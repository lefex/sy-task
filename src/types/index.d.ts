// SYPipeline
export type PipelineData = Record<string, any>;
export type NextFn = (data?: any) => void;
export type MiddleWareFn = (data: Data, next: NextFn) => void;

export class SYPipeline {
    data: PipelineData;
    constructor(data: PipelineData);
    use(handler: MiddleWareFn): void;
    next(error: Error): void;
    run(): void;
}

// SYQueue
export interface ResData {
    [x: string]: any;
}
export type Task = ((data?: any) => any) | Promise<any>;

export class SYQueue {
    tasks: Task[];
    data: ResData;
    constructor(data?: ResData);
    race(this: any, tasks: Task[]): Promise<any>;
    serial(this: any, tasks: Task[]): Promise<any>;
    parallel(this: any, tasks: Task[], limit: number): Promise<any>;
}