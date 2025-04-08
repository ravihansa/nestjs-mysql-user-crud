import { Cache } from 'cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CustomCache {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async getCache(cacheKey: string): Promise<any> {
        const cachedItem = await this.cacheManager.get<any>(cacheKey);
        if (cachedItem) {
            return cachedItem;
        }
        return null;
    }

    async setCache(cacheKey: string, item: any, ttl: number): Promise<void> {
        await this.cacheManager.set(cacheKey, item, ttl);
    }
}
