import { DatabaseBackEnd } from "./backEnd.js";
import { DatabaseMiddleEnd, FastDatabaseMiddleEnd, LargeDatabaseMiddleEnd } from "./middleEnd.js";

interface UnknownMap {
    [key: string]: unknown;
}
type StringForced<T> = T extends string ? T : never;
export abstract class DatabaseFrontEnd<M = UnknownMap> {
    public static create<T extends UnknownMap>(
        this: new (mid: DatabaseMiddleEnd) => DatabaseFrontEnd<T>,
        options: { namespace: string; target: DatabaseBackEnd; large?: boolean }
    ): DatabaseFrontEnd<T> {
        const middle = options.large
            ? new LargeDatabaseMiddleEnd(options.target, options.namespace)
            : new FastDatabaseMiddleEnd(options.target, options.namespace);
        return new this(middle);
    }

    public readonly middle_end: DatabaseMiddleEnd;
    public readonly cache: Map<string, unknown> = new Map();
    public constructor(middle_end: DatabaseMiddleEnd) {
        this.middle_end = middle_end;
    }
    public abstract serialize(value: unknown): string;
    public abstract deserialize(value: string): unknown;
    public get<K extends keyof M>(key: StringForced<K>): M[K] | null {
        if (this.cache.has(key)) {
            return this.cache.get(key) as M[K];
        }

        const raw = this.middle_end.get(key);
        if (raw === null) {
            return null;
        }

        const data = this.deserialize(raw);
        this.cache.set(key, data);
        return data as M[K];
    }
    public set<K extends keyof M>(key: StringForced<K>, value: M[K]): void {
        this.cache.set(key, value);
        const raw = this.serialize(value);
        this.middle_end.set(key, raw);
    }
    public delete<K extends keyof M>(key: StringForced<K>): void {
        this.cache.delete(key);
        this.middle_end.delete(key);
    }
    public keys(): StringForced<keyof M>[] {
        return this.middle_end.keys() as unknown as StringForced<keyof M>[];
    }
    public clear(): void {
        this.cache.clear();
        for (const key of this.keys()) {
            this.delete(key);
        }
    }
}

export class JsonDatabase<M = UnknownMap> extends DatabaseFrontEnd<M> {
    public override serialize(value: unknown): string {
        return JSON.stringify(value);
    }
    public override deserialize(value: string): unknown {
        return JSON.parse(value);
    }
}
