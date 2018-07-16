import {CachePackageRequestOptions} from './StoreService';

export interface CacheStoreOptions<TData> extends CachePackageRequestOptions {
    fallback?: CacheStoreFallbackFunction<TData>;
}

export interface CacheStoreFallbackFunction<TData> {
    (): Promise<TData>;
}