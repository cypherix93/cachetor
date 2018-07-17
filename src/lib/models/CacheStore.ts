export interface CacheStoreOptions<TData> {
    timeout?: number;
    invalidationToken?: () => string;
    fallback?: () => Promise<TData>;
}