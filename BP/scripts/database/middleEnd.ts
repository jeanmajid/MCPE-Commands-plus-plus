/* SPDX-License-Identifier: GPL-3.0-or-later
 * ============================================================================
 * Commands Plus Plus
 * Copyright (C) 2024-2026 jeanmajid and contributors
 * https://github.com/jeanmajid/MCPE-Commands-plus-plus
 * ============================================================================
 *
 * This file is part of Commands Plus Plus.
 *
 * Commands Plus Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Commands Plus Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Commands Plus Plus. If not, see <https://www.gnu.org/licenses/>.
 */

import type { DatabaseBackEnd } from "./backEnd.js";

const MAX_CHUNK_SIZE = 32_000; //32768 unicode doesn't properly map to bytes, cus utf8 i guess

export abstract class DatabaseMiddleEnd {
    public readonly namespace: string;
    public readonly backend: DatabaseBackEnd;
    public constructor(backend: DatabaseBackEnd, namespace: string) {
        this.backend = backend;
        this.namespace = namespace;
        if (namespace.includes("\\")) {
            throw new SyntaxError("Backslash is not allowed inside a namespace identifier");
        }
        if (namespace.length > 32) {
            throw new SyntaxError("Namespace length is limited to 32 characters");
        }
    }
    protected root(): string {
        return `\\??\\${this.namespace.padEnd(32, "\\")}\\`;
    }
    public abstract get(key: string): string | null;
    public abstract set(key: string, value: string): void;
    public abstract delete(key: string): void;
    public abstract keys(): string[];
}

interface FieldMetadata {
    key: string;
    data: string;
    length: number;
}

export class LargeDatabaseMiddleEnd extends DatabaseMiddleEnd {
    protected resolve(key: string, index: number): string {
        return `${this.root()}${index.toString(16).padStart(4, "0")}\\${key}`;
    }

    private getMetadata(key: string): FieldMetadata | null {
        const root_key = this.resolve(key, 0);
        const root_data = this.backend.getDynamicProperty(root_key);
        if (typeof root_data !== "string") {
            return null;
        }

        const length = parseInt(root_data.substring(0, 4), 16);
        if (!Number.isFinite(length)) {
            return null;
        }

        return { key: key, length: length, data: root_data.substring(4) };
    }

    private *getIterator(metadata: FieldMetadata): Generator<string> {
        for (let i = 0; i < metadata.length; ++i) {
            yield this.resolve(metadata.key, i);
        }
    }

    public get(key: string): string | null {
        const metadata = this.getMetadata(key);
        if (!metadata) {
            return null;
        }

        const iterator = this.getIterator(metadata);
        const chunks = [metadata.data];
        void iterator.next(); // Skip this one we already got it from metadata
        for (const chunk_key of iterator) {
            const raw = this.backend.getDynamicProperty(chunk_key);
            console.log("chunk:", raw);
            if (typeof raw !== "string") {
                return null;
            }

            chunks.push(raw);
        }
        return chunks.join("");
    }

    public set(key: string, value: string): void {
        const metadata = this.getMetadata(key);
        const chunk_length = Math.ceil(value.length / MAX_CHUNK_SIZE);
        let i = 0;
        for (; i < chunk_length; ++i) {
            const chunk = value.substring(i * MAX_CHUNK_SIZE, (i + 1) * MAX_CHUNK_SIZE);
            const raw_key = this.resolve(key, i);

            if (i === 0) {
                this.backend.setDynamicProperty(
                    raw_key,
                    chunk_length.toString(16).padStart(4, "0") + chunk
                );
                continue;
            }

            this.backend.setDynamicProperty(raw_key, chunk);
        }

        if (metadata) {
            // Removed pending data
            for (; i < metadata.length; i++) {
                this.backend.setDynamicProperty(this.resolve(key, i), undefined);
            }
        }
    }

    public delete(key: string): void {
        const metadata = this.getMetadata(key);
        if (!metadata) {
            // might be useful in the future who knows
            return void false;
        }

        for (const raw of this.getIterator(metadata)) {
            this.backend.setDynamicProperty(raw, undefined);
        }
        return void true;
    }

    public keys(): string[] {
        const length = this.root().length;

        const keys = [];

        for (const raw of this.backend.getDynamicPropertyIds()) {
            const index = raw.substring(length, length + 4);

            if (parseInt(index) !== 0) {
                continue;
            }

            keys.push(raw.substring(length + 5));
        }

        return keys;
    }
}

export class FastDatabaseMiddleEnd extends DatabaseMiddleEnd {
    protected resolve(key: string): string {
        return `${this.root()}-\\${key}`;
    }

    public get(key: string): string | null {
        const data = this.backend.getDynamicProperty(this.resolve(key));
        if (typeof data !== "string") {
            return null;
        }

        return data;
    }

    public set(key: string, value: string): void {
        if (value.length >= MAX_CHUNK_SIZE) {
            throw new ReferenceError("database: Max value sizes exceed.");
        }

        const raw = this.resolve(key);
        this.backend.setDynamicProperty(raw, value);
    }

    public delete(key: string): void {
        this.backend.setDynamicProperty(this.resolve(key), undefined);
    }

    public keys(): string[] {
        const length = this.root().length;
        return this.backend.getDynamicPropertyIds().map((_) => _.substring(length));
    }
}
