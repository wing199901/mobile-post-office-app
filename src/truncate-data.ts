import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MobilePostsService } from './mobile-posts/mobile-posts.service';
import { DataSource } from 'typeorm';
import * as readline from 'readline';

/**
 * Truncate (clear) all mobile post records from the database
 * This script provides a safe way to delete all records with confirmation
 */

// Create readline interface for user input
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

// Ask for confirmation
function askConfirmation(question: string): Promise<boolean> {
  const rl = createReadlineInterface();

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      const normalized = answer.toLowerCase().trim();
      resolve(normalized === 'yes' || normalized === 'y');
    });
  });
}

// Count records before truncation
async function countRecords(service: MobilePostsService): Promise<number> {
  const result = await service.findAll({
    page: 1,
    limit: 1,
    lang: 'en',
  });
  return result.meta.total;
}

// Truncate the mobile_posts table
async function truncateTable(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    console.log('\nTruncating mobile_posts table...');

    // Disable foreign key checks temporarily (for safety)
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');

    // Truncate the table (faster than DELETE and resets auto-increment)
    await queryRunner.query('TRUNCATE TABLE mobile_posts');

    // Re-enable foreign key checks
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✅ Table truncated successfully');
  } catch (error) {
    console.error('❌ Error truncating table:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}

// Main truncate function
async function truncateData(): Promise<void> {
  console.log('==========================================');
  console.log('Mobile Post Office - Database Truncation');
  console.log('==========================================\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const mobilePostsService = app.get(MobilePostsService);
  const dataSource = app.get(DataSource);

  try {
    // Count existing records
    const recordCount = await countRecords(mobilePostsService);

    if (recordCount === 0) {
      console.log('ℹ️  Database is already empty. No records to delete.\n');
      await app.close();
      return;
    }

    console.log(
      `⚠️  WARNING: This will delete ALL ${recordCount} records from the database!`,
    );
    console.log('⚠️  This action CANNOT be undone!\n');

    // Ask for confirmation
    const confirmed = await askConfirmation(
      'Are you sure you want to proceed? (yes/no): ',
    );

    if (!confirmed) {
      console.log('\n❌ Truncation cancelled by user.\n');
      await app.close();
      return;
    }

    // Double confirmation for extra safety
    const doubleConfirmed = await askConfirmation(
      '\n⚠️  Final confirmation - Type "yes" to DELETE ALL RECORDS: ',
    );

    if (!doubleConfirmed) {
      console.log('\n❌ Truncation cancelled by user.\n');
      await app.close();
      return;
    }

    // Perform truncation
    await truncateTable(dataSource);

    // Verify truncation
    const remainingRecords = await countRecords(mobilePostsService);

    console.log('\n==========================================');
    console.log('Truncation Summary');
    console.log('==========================================');
    console.log(`Records before: ${recordCount}`);
    console.log(`Records after: ${remainingRecords}`);
    console.log(`Records deleted: ${recordCount - remainingRecords}`);
    console.log('==========================================\n');

    if (remainingRecords === 0) {
      console.log('✅ Database truncation completed successfully!\n');
    } else {
      console.warn(
        '⚠️  Warning: Some records may still remain in the database.\n',
      );
    }
  } catch (error) {
    console.error('\n❌ Fatal error during truncation:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

// Run the truncation
void truncateData();
