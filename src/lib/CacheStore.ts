import {CacheStoreOptions} from './models/CacheStore';
import {StoreService} from './services/StoreService';

export class CacheStore<TData> {

    private readonly __key: string;
    private readonly __options: CacheStoreOptions<TData>;

    constructor(key: string, options?: CacheStoreOptions<TData>) {
        this.__key = key;

        options.timeout = options.timeout || (60 * 60); // 1 hr

        this.__options = options;
    }

    async get(): Promise<TData> {
        let key = this.__key;
        let options = this.__options;

        let invalidationToken;
        if (options.invalidationToken) {
            invalidationToken = options.invalidationToken.call(null);
        }

        const cacheRequestOptions = {
            timeout: options.timeout,
            invalidationToken
        };

        const cached = StoreService.get<TData>(key, cacheRequestOptions);

        if (cached) {
            return cached;
        }

        // If no fallback is provided, just return nothing
        if (!options.fallback) {
            return null;
        }

        const fallbackData = await options.fallback.call(null);

        if (fallbackData) {
            StoreService.set(key, fallbackData, cacheRequestOptions);
        }

        return fallbackData;
    }

    async set(value: TData) {
        let key = this.__key;
        let options = this.__options;

        StoreService.set(key, value, {timeout: options.timeout});
    }
}
