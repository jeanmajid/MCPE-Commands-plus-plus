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

import { system } from "@minecraft/server";

export class TaskManager {
    public readonly tasks: void[] = [];
    public run<T = unknown>(): Task<T> {
        return null!;
    }
    public runInterval<T = unknown>(): Task<T> {
        return null!;
    }

    public runIterator<T>(iterable: Iterable<void, T>): Task<T> {
        const iterator = iterable[Symbol.iterator]();
        const task = new GeneratorTask<T>(iterator);
        task.run();

        return task;
    }
}

export interface Task<T> {
    cancel(): Promise<void>;
    wait(): Promise<T>;
    suspend?(): void; //Mostly unsupported
    resume?(): void; //Mostly unsupported
}

export interface FunctionTask<_> {}

/** Implementation for iterators like code that yields a lot */
export class GeneratorTask<T> implements Task<T> {
    protected jobId: number | null = null;
    protected promise: Promise<T> | null = null;
    protected isCanceled: boolean = false;
    protected runtimeGen: Generator<void, void, void> | null = null;
    public readonly iterator: Iterator<void, T>;
    public constructor(iterator: Iterator<void, T>) {
        this.iterator = iterator;
    }
    public run(): void {
        if (this.jobId !== null || this.runtimeGen !== null) {
            throw new ReferenceError("Task is already running");
        }

        const { promise, reject, resolve } = Promise.withResolvers<T>();

        this.promise = promise;
        this.runtimeGen = this.runtime(
            (res) => {
                resolve(res);
                this.jobId = null;
                this.runtimeGen = null;
                this.promise = null;
            },
            (err) => {
                reject(err);
                this.jobId = null;
                this.runtimeGen = null;
                this.promise = null;
            }
        );
        this.suspend();
    }
    public async cancel(): Promise<void> {
        this.isCanceled = true;
        if (this.promise) {
            return this.promise.then(
                () => void null,
                () => void null
            );
        }

        return void null;
    }

    public async wait(): Promise<T> {
        if (!this.promise) {
            throw new ReferenceError("Action is not running");
        }

        return this.promise;
    }
    public *runtime(res: (t: T) => void, rej: (err: Error) => void): Generator<void, void, void> {
        const ite = this.iterator;

        while (!this.isCanceled) {
            try {
                const { done, value } = ite.next();
                if (done) {
                    return void res(value);
                }
            } catch (err) {
                return void rej(err as Error);
            }
            yield;
        }

        if (ite.throw) {
            try {
                while (!ite.throw(new CancelError("Canceled")).done) {}
            } catch (err) {
                return void rej(err as Error);
            }
        } else if (ite.return) {
            while (!ite.return().done) {}
        }

        return void rej(new CancelError());
    }

    public suspend(): void {
        if (this.jobId === null) {
            throw new ReferenceError("Generator is not running");
        }

        system.clearJob(this.jobId);
        this.jobId = null;
    }
    public resume(): void {
        if (this.jobId !== null || this.runtimeGen === null) {
            throw new ReferenceError("Generator is already running");
        }

        this.jobId = system.runJob(this.runtimeGen);
    }
}

export class CancelError extends Error {}
