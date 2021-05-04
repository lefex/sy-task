/**
 * @file pipleline.test.ts
 * @author suyan
 * @description to test pipleline
 * @document https://www.jestjs.cn/docs/getting-started
 */

import SYPipeline from '../src/pipeline';

test('new Pileline with data.name equal suyan', () => {
    let data = {
        name: 'suyan'
    };
    let pipeline = new SYPipeline(data);
    expect(pipeline.data.name).toBe('suyan');
});

test('pipeline use sync task, taskId equal every', done => {
    let data = {
        taskId: ''
    };
    let pipeline = new SYPipeline(data);
    pipeline.use((data, next) => {
        data.taskId = 'every';
        next();
    });
    pipeline.use((data, next) => {
        try {
            expect(data.taskId).toBe('every');
            done();
        } catch (error) {
            done(error);
        }
    });
    pipeline.run();
});

test('pipeline use async task, taskId equal everyasync', done => {
    let data = {
        taskId: ''
    };
    let pipeline = new SYPipeline(data);
    pipeline.use((data, next) => {
        setTimeout(() => {
            data.taskId = 'everyasync';
            next();
        }, 2);
    });
    pipeline.use((data, next) => {
        try {
            expect(data.taskId).toBe('everyasync');
            done();
        } catch (error) {
            done(error);
        }
    });
    pipeline.run();
});

test('pipeline use sync/async task, 3 task finished', done => {
    let data = {
        tasks: []
    };
    let pipeline = new SYPipeline(data);
    pipeline.use((data, next) => {
        setTimeout(() => {
            data.tasks.push('task1');
            next();
        }, 4);
    });
    pipeline.use((data, next) => {
        setTimeout(() => {
            data.tasks.push('task2');
            next();
        }, 0);
    });
    pipeline.use((data, next) => {
        setTimeout(() => {
            data.tasks.push('task3');
            next();
        }, 9);
    });
    pipeline.use((data, next) => {
        try {
            expect(data.tasks.join(',')).toBe('task1,task2,task3');
            done();
        } catch (error) {
            done(error);
        }
    });
    pipeline.run();
});

test('pipeline this in => function', done => {
    const popManager = {
        data: {
            taskId: 'every'
        },
        name: 'suyan',
        run(this: any) {
            // create a pipeline
            let pipeline = new SYPipeline(this.data);

            // add task
            pipeline.use((data, next) => {
                try {
                    expect(this.name).toBe('suyan');
                    expect(data.taskId).toBe('every');
                    done();
                } catch (error) {
                    done(error);
                }
            });
            pipeline.run();
        }
    };
    popManager.run();
});

test('pipeline this in common function', done => {
    const popManager = {
        data: {
            name: 'every'
        },
        name: 'suyan',
        getName(this: any) {
            return this.name;
        },
        run(this: any) {
            // create a pipeline
            let pipeline = new SYPipeline(this.data);

            // add task
            let that = this;
            pipeline.use(function (data, next) {
                data.name = that.getName();
                next();
            });
            // add task
            pipeline.use((data, next) => {
                try {
                    expect(data.name).toBe('suyan');
                    done();
                } catch (error) {
                    done(error);
                }
            });
            pipeline.run();
        }
    };
    popManager.run();
});