import * as store from 'store';
import {CachePackage, CachePackageRequestOptions} from '../models/StoreService';

export namespace StoreService {

    export function get<TData>(key: string, options?: CachePackageRequestOptions): TData {
        if (!store.enabled) {
            return null;
        }

        const data = store.get(key) as CachePackage<TData>;

        if (!data) {
            return null;
        }

        // If expired, remove from store
        if (Date.now() > data.e) {
            remove(key);

            return null;
        }

        // If invalidation token is a mismatch, remove from store
        if (data.t && options.invalidationToken && data.t !== options.invalidationToken) {
            remove(key);

            return null;
        }

        return data.v;
    }

    export function set<TData>(key: string, value: TData, options?: CachePackageRequestOptions): TData {
        if (!store.enabled) {
            return;
        }

        const dataToStore = {v: value} as CachePackage<TData>;

        // Set expiration if provided
        if (options.timeout) {
            dataToStore.e = Date.now() + options.timeout;
        }

        // Set invalidation token if provided
        if (options.invalidationToken) {
            dataToStore.t = options.invalidationToken;
        }

        store.set(key, dataToStore);

        return value;
    }

    export function remove(key: string): void {
        if (!store.enabled) {
            return;
        }

        store.remove(key);
    }

    export async function clear() {
        if (!store.enabled) {
            return;
        }

        store.clearAll();
    }
}
