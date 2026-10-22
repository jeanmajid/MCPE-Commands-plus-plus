/* SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
 * ============================================================================
 * Commands Plus Plus
 * Copyright (C) 2024-2026 jeanmajid and contributors
 * https://github.com/jeanmajid/MCPE-Commands-plus-plus
 * ============================================================================
 *
 * This file is part of Commands Plus Plus.
 *
 * Licensed under the PolyForm Noncommercial License 1.0.0.
 * You may use, modify, and redistribute this software for permitted
 * noncommercial purposes, subject to the terms of that license.
 *
 * Commercial use requires separate authorization from the applicable
 * copyright holder.
 *
 * The complete license text is available at:
 * https://polyformproject.org/licenses/noncommercial/1.0.0
 */

import { DatabaseBackEnd } from "./backEnd.js";
import { DatabaseMiddleEnd, FastDatabaseMiddleEnd, LargeDatabaseMiddleEnd } from "./middleEnd.js";

interface UnknownMap {
    [key: string]: unknown;
}

type StringForced<T> = T extends string ? T : never;

export abstract class DatabaseFrontEnd<M = UnknownMap> {
    public static create<T extends UnknownMap>(
        this: new (mid: DatabaseMiddleEnd) => DatabaseFrontEnd<UnknownMap>,
        options: { namespace: string; target: DatabaseBackEnd; large?: boolean }
    ): DatabaseFrontEnd<T> {
        const middle = options.large
            ? new LargeDatabaseMiddleEnd(options.target, options.namespace)
            : new FastDatabaseMiddleEnd(options.target, options.namespace);

        return new this(middle) as unknown as DatabaseFrontEnd<T>;
    }

    public readonly middleEnd: DatabaseMiddleEnd;
    public readonly cache: Map<string, unknown> = new Map();

    public constructor(middle_end: DatabaseMiddleEnd) {
        this.middleEnd = middle_end;
    }

    public abstract serialize(value: unknown): string;
    public abstract deserialize(value: string): unknown;

    public get<K extends keyof M>(key: StringForced<K>): M[K] | null {
        if (this.cache.has(key)) {
            return this.cache.get(key) as M[K];
        }

        const raw = this.middleEnd.get(key);
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
        this.middleEnd.set(key, raw);
    }

    public delete<K extends keyof M>(key: StringForced<K>): void {
        this.cache.delete(key);
        this.middleEnd.delete(key);
    }

    public keys(): StringForced<keyof M>[] {
        return this.middleEnd.keys() as unknown as StringForced<keyof M>[];
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
