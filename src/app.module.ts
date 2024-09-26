import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:password@localhost:27017', {
      authSource: 'admin',  // Keep this if you are using authentication
    }),
  ],
})
export class AppModule { }
