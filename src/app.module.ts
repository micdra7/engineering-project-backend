import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './utils/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
