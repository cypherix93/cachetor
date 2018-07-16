// The properties are single-letter in order to preserve LocalStorage space (as much as possible)
export interface CachePackage<TData> {
    v: TData; // Data to store
    e: number; // Date when this will expire
    t: string; // Invalidation token
}

export interface CachePackageRequestOptions {
    timeout?: number;
    invalidationToken?: string;
}