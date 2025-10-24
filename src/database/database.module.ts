import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'mobile_post_office'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false, // Use migrations in production
        logging: configService.get('NODE_ENV') === 'development',

        // Connection pool settings
        extra: {
          connectionLimit: 10,
          waitForConnections: true,
          queueLimit: 0,
        },

        // Auto-reconnection settings
        retryAttempts: 10,
        retryDelay: 3000, // 3 seconds between retry attempts
        autoLoadEntities: true,
        keepConnectionAlive: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
