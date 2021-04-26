import Pipeline from './pipeline.js';

export const popManager = {
    data: {
        taskId: ''
    },
    run() {
        // create a pipeline
        let pipeline = new Pipeline(this.data);

        // add task
        pipeline.use((data, next) => {
            console.log(data);
            if (data.taskId) {
                // find the task, stop run
            }
            else {
                next();
            }
        });

        // add task
        pipeline.use((data, next) => {
            console.log(data);
            setTimeout(() => {
                data.taskId = 'everydata';
                next();
            }, 200);
        });

        // add task 3
        pipeline.use(function (data, next) {
            console.log(data);
            if (data.taskId) {
                // find the task, stop run
            }
            else {
                next();
            }
        });

        // 开启任务
        pipeline.run();
    }
};
