import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UpdateController } from './shipapi/update/update.controller';
import { VideoController } from './video/video.controller';

@Module({
  imports: [],
  controllers: [AppController, UpdateController, VideoController],
  providers: [AppService],
})
export class AppModule {}
