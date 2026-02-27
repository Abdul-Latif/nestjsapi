import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './uploads.controller';

@Module({
  controllers: [UploadController],
  imports: [MulterModule.register()],
})
export class UploadModule {}
