/**
 * @file queue.ts
 * @author suyan
 * @description task excute in queue
 */

export interface ResData {
    [x: string]: any;
}
export type Task = ((data?: any) => any) | Promise<any>;

export default class Queue {
    tasks: Task[] = [];
    data: ResData;

    constructor(data?: ResData) {
        // can use custom data
        this.data = data ? data : {};
    }

    isPromise(task: Task): boolean {
        return !!(task && typeof task === 'object' && task.then);
    }

    promiseAtIndex(index: number): Promise<any> {
        const next = this.tasks[index];
        if (next) {
            let promise = typeof next === 'function' ? next(this.data) : next;
            if (!this.isPromise(promise)) {
                promise = Promise.resolve(promise);
            }
            return promise;
        }
        return next;
    }

    race(this: any, tasks: Task[]): Promise<any> {
        this.tasks = tasks;
        if (this.tasks && !Array.isArray(this.tasks)) {
            throw Error('arguments must be array');
        }
        return new Promise((resolve, reject) => {
            let curPromise: Promise<any>;
            let index: number = 0;
            const loop = (task?: Promise<any>) => {
                if (!task) {
                    reject('no resolve task');
                    return;
                }

                const loopNext = () => {
                    index += 1;
                    curPromise = this.promiseAtIndex(index);
                    loop(curPromise);
                };

                // task is promise
                if (!curPromise) {
                    curPromise = task;
                }
                // excute task one by one, if find resolve task, return it
                curPromise.then(res => {
                    if (res) {
                        this.data[index] = index;
                        resolve(res);
                    }
                    else {
                        loopNext();
                    }
                }).catch(() => {
                    // excute next task if error
                    loopNext();
                });
            };
            // begin run first task
            loop(this.promiseAtIndex(index));
        });
    }

    serial(this: any, tasks: Task[]): Promise<any> {
        this.tasks = tasks;
        if (this.tasks && !Array.isArray(this.tasks)) {
            throw Error('arguments must be array');
        }
        return new Promise((resolve, reject) => {
            let curPromise: Promise<any>;
            let index: number = 0;
            const loop = (task?: Promise<any>) => {
                if (!task) {
                    resolve(this.data);
                    return;
                }

                const loopNext = () => {
                    index += 1;
                    curPromise = this.promiseAtIndex(index);
                    loop(curPromise);
                };

                // task is promise
                if (!curPromise) {
                    curPromise = task;
                }
                // excute task one by one
                curPromise.then(res => {
                    this.data[index] = res;
                    loopNext();
                }).catch(error => {
                    reject(error);
                });
            };
            // begin run first task
            loop(this.promiseAtIndex(index));
        });
    }

    parallel(this: any, tasks: Task[], limit: number): Promise<any> {
        this.tasks = tasks;
        if (tasks && !Array.isArray(tasks)) {
            throw Error('arguments must be array');
        }

        if (limit <= 0) {
            throw Error('limit must be > 0');
        }

        if (!tasks || tasks.length === 0) {
            return Promise.resolve();
        }

        // must less than task length
        if (limit > tasks.length) {
            limit = tasks.length;
        }

        return new Promise((resolve, reject) => {
            let curIndex: number = 0;
            let remaining: number = 0;
            const resolveFn = (promise: Promise<any>, index: number) => {
                promise.then(res => {
                    this.data[index] = res;
                    remaining--;
                    if (remaining === 0) {
                        resolve(this.data);
                    }
                    else {
                        curIndex++;
                        if (curIndex < tasks.length) {
                            let promise = this.promiseAtIndex(curIndex);
                            resolveFn(promise, curIndex);
                        }
                    }
                }).catch(error => {
                    reject(error);
                });
            };
            // 6 - 3
            curIndex = limit - 1;
            remaining = tasks.length;
            for (let i = 0; i < limit; i++) {
                let promise = this.promiseAtIndex(i);
                resolveFn(promise, i);
            }
        });
    }
}