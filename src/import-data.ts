import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MobilePostsService } from './mobile-posts/mobile-posts.service';
import { MobilePostData } from './mobile-posts/types/mobile-post-data.type';
import axios from 'axios';
import { promises as fs } from 'fs';
import * as path from 'path';

interface ImportStats {
  successCount: number;
  errorCount: number;
  duplicateCount: number;
  errors: Array<{ record: number; error: string }>;
  irregularities: Array<{ record: number; issue: string }>;
}

// Fetch records from URL or file
async function loadRecords(dataSource?: string): Promise<MobilePostData[]> {
  if (dataSource?.startsWith('http://') || dataSource?.startsWith('https://')) {
    console.log(`Fetching data from URL: ${dataSource}`);
    const response = await axios.get<unknown>(dataSource);
    const data = response.data;

    // Handle different response formats
    let records: MobilePostData[] = [];
    if (Array.isArray(data)) {
      records = data;
    } else if (data && typeof data === 'object') {
      const objData = data as Record<string, unknown>;
      if (Array.isArray(objData.data)) {
        records = objData.data;
      } else if (Array.isArray(objData.records)) {
        records = objData.records;
      } else {
        // Try to find first array property
        const firstArray = Object.values(objData).find(Array.isArray);
        if (firstArray) {
          records = firstArray as MobilePostData[];
        }
      }
    }

    if (records.length === 0) {
      throw new Error('Unable to find array of records in API response');
    }

    console.log(`Fetched ${records.length} records from URL\n`);
    return records;
  }

  // Load from file
  if (!dataSource) {
    console.error('Error: No data source provided.');
    console.error('Usage:');
    console.error('  npm run import <url-or-file-path>');
    console.error('\nExamples:');
    console.error('  npm run import https://example.com/data.json');
    console.error('  npm run import ./sample-data.json');
    process.exit(1);
  }

  try {
    console.log(`Loading data from file: ${dataSource}`);
    const fileContent = await fs.readFile(dataSource, 'utf-8');
    const records = JSON.parse(fileContent) as MobilePostData[];
    console.log(`Loaded ${records.length} records from file\n`);
    return records;
  } catch (error) {
    console.error(`Error: Unable to read file: ${dataSource}`);
    console.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

// Validate and normalize a single record
function normalizeRecord(
  record: MobilePostData,
  index: number,
  stats: ImportStats,
): Omit<MobilePostData, 'latitude' | 'longitude'> & {
  latitude?: number;
  longitude?: number;
} {
  // Handle coordinates that might be string, number, or undefined
  const latValue = record.latitude;
  const lngValue = record.longitude;

  const lat =
    typeof latValue === 'string'
      ? parseFloat(latValue)
      : typeof latValue === 'number'
        ? latValue
        : NaN;

  const lng =
    typeof lngValue === 'string'
      ? parseFloat(lngValue)
      : typeof lngValue === 'number'
        ? lngValue
        : NaN;

  // Track irregularities
  if (Number.isNaN(lat) || lat < -90 || lat > 90) {
    stats.irregularities.push({
      record: index + 1,
      issue: `Invalid latitude: ${record.latitude}`,
    });
  }

  if (Number.isNaN(lng) || lng < -180 || lng > 180) {
    stats.irregularities.push({
      record: index + 1,
      issue: `Invalid longitude: ${record.longitude}`,
    });
  }

  return {
    ...record,
    latitude: Number.isNaN(lat) ? undefined : lat,
    longitude: Number.isNaN(lng) ? undefined : lng,
  };
}

// Import all records
async function importRecords(
  records: MobilePostData[],
  service: MobilePostsService,
): Promise<ImportStats> {
  const stats: ImportStats = {
    successCount: 0,
    errorCount: 0,
    duplicateCount: 0,
    errors: [],
    irregularities: [],
  };

  console.log('Importing records...\n');

  for (let i = 0; i < records.length; i++) {
    try {
      const normalized = normalizeRecord(records[i], i, stats);
      await service.create(normalized);
      stats.successCount++;

      if ((i + 1) % 50 === 0) {
        console.log(`Processed ${i + 1}/${records.length} records...`);
      }
    } catch (error: unknown) {
      const err = error as {
        errCode?: string;
        message?: string;
        errMsg?: string;
      };
      if (err.errCode === '0301') {
        stats.duplicateCount++;
      } else {
        stats.errorCount++;
        stats.errors.push({
          record: i + 1,
          error: err.message || err.errMsg || 'Unknown error',
        });
      }
    }
  }

  return stats;
}

// Print import summary
function printSummary(stats: ImportStats, totalRecords: number): void {
  console.log('\n=====================================');
  console.log('Import Summary');
  console.log('=====================================');
  console.log(`Total records: ${totalRecords}`);
  console.log(`Successfully imported: ${stats.successCount}`);
  console.log(`Duplicates skipped: ${stats.duplicateCount}`);
  console.log(`Errors: ${stats.errorCount}`);
  console.log(`Irregularities found: ${stats.irregularities.length}`);
  console.log('=====================================\n');

  // Log irregularities
  if (stats.irregularities.length > 0) {
    console.log('Irregularities:');
    stats.irregularities.slice(0, 20).forEach((irreg) => {
      console.log(`  Record ${irreg.record}: ${irreg.issue}`);
    });
    if (stats.irregularities.length > 20) {
      console.log(`  ... and ${stats.irregularities.length - 20} more\n`);
    }
  }

  // Log errors
  if (stats.errors.length > 0) {
    console.log('\nErrors:');
    stats.errors.slice(0, 10).forEach((err) => {
      console.log(`  Record ${err.record}: ${err.error}`);
    });
    if (stats.errors.length > 10) {
      console.log(`  ... and ${stats.errors.length - 10} more\n`);
    }
  }
}

// Save import report
async function saveReport(
  stats: ImportStats,
  dataSource: string | undefined,
  totalRecords: number,
): Promise<void> {
  const report = {
    timestamp: new Date().toISOString(),
    dataSource: dataSource || 'data.json',
    totalRecords,
    successCount: stats.successCount,
    duplicateCount: stats.duplicateCount,
    errorCount: stats.errorCount,
    irregularities: stats.irregularities,
    errors: stats.errors,
  };

  const reportPath = path.join(process.cwd(), 'import-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nImport report saved to: ${reportPath}`);
}

// Main import function
async function importData(): Promise<void> {
  console.log('Starting data import...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const mobilePostsService = app.get(MobilePostsService);
  const dataSource = process.argv[2];

  try {
    const records = await loadRecords(dataSource);
    const stats = await importRecords(records, mobilePostsService);

    printSummary(stats, records.length);
    await saveReport(stats, dataSource, records.length);
  } catch (error) {
    console.error('Fatal error during import:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

// Start import process
void importData();
