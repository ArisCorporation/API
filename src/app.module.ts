import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UpdateController } from './shipapi/update/update.controller';
import { VideoController } from './video/video.controller';
import { NextController } from './shipapi/update/next/next.controller';
import { PingController } from './ping/ping.controller';

@Module({
  imports: [],
  controllers: [AppController, UpdateController, VideoController, NextController, PingController],
  providers: [AppService],
})
export class AppModule {}
