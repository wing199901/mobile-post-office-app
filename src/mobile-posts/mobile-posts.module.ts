import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobilePostsController } from './mobile-posts.controller';
import { MobilePostsService } from './mobile-posts.service';
import { MobilePost } from './entities/mobile-post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MobilePost])],
  controllers: [MobilePostsController],
  providers: [MobilePostsService],
  exports: [MobilePostsService],
})
export class MobilePostsModule {}
