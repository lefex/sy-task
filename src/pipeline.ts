/**
 * @file pipeline.ts
 * @author suyan
 * @description the pipeline
 */

export interface Data {
    [x: string]: any;
}
export type PipelineData = Record<string, any>;
export type NextData = any;
export type NextFn = (data?: NextData) => void;
export type MiddleWareFn = (data: Data, next: NextFn) => void;

const DEBUG = false;
const debug = (msg: any) => {
    if (DEBUG) {
        // eslint-disable-next-line no-console
        console.log(msg);
    }
};

class Layer {
    handle: MiddleWareFn;
    params?: Record<string, any>;

    constructor(handle: MiddleWareFn, params?: any) {
        this.handle = handle;
        this.params = params;
    }

    excute(data: PipelineData, next: NextFn) {
        let fn = this.handle;
        try {
            fn(data, next);
        }
        catch (error) {
            next(error);
        }
    }
}

export default class Pipeline {
    data: PipelineData;
    private readonly _stacks: Layer[] = [];
    private _runIndex: number = 0;

    constructor(data: PipelineData) {
        this.data = data || {};
    }

    use(handler: MiddleWareFn) {
        if (handler.length === 0) {
            throw new TypeError('pipeline.use() requires a middleware function');
        }
        const layer = new Layer(handler);
        this._stacks.push(layer);
    }

    next(error: Error) {
        if (error) {
            debug(error);
            return;
        }
        if (this._runIndex >= this._stacks.length - 1) {
            debug('index if more than stack length');
            return;
        }

        this._runIndex += 1;
        this._executeAnIndex(this._runIndex);

        debug('call next');
    }

    run() {
        debug('begin run');
        this._runIndex = 0;
        this._executeAnIndex(this._runIndex);
    }

    private _executeAnIndex(index: number) {
        debug(`begin excure: ${index}`);
        let layer = this._stacks[index];
        layer.excute(this.data, this.next.bind(this));
    }
}
