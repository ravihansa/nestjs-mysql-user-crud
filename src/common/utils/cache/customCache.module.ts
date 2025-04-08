import { Module } from '@nestjs/common';
import { CustomCache } from './customCache.service';

@Module({
    providers: [CustomCache],
    exports: [CustomCache], // Makes it available to importing module

})
export class CustomCacheModule { }
