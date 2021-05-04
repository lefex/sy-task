# sy-task

easy run sync or asyn task

## install

```shell
npm install sy-task
```

## run this project

```shell
npm run dev

then:
open in browser http://localhost:8888/pipeline.html
open in browser http://localhost:8888/queue.html
```

## pipeline

Add three tasks to pipeline, they will run one by one. You can call next function to run next task that in pipeline.

```js
// create a pipeline
// The data can be used in every task
let data = {};
let pipeline = new SYPipeline(data);

// The use method to add task to pipeline
// add sync task to pipeline, the task must a function that have (data, next) params
pipeline.use((data, next) => {
    doSomething();
    // run next task
    next();
});

// add async task to pipeline
pipeline.use((data, next) => {
    setTimeout(() => {
        // you can change data, add property taskId to data
        data.taskId = 'everydata';
        next();
    }, 200);
});

// add sync task to pipeline
pipeline.use(function (data, next) {
    if (data.taskId) {
        // find the task, stop run
    }
    else {
        next();
    }
});

// the task begin run
pipeline.run();
```

## queue.race

Run task one by one, if the task resolve a truely value, the queue stop.

```js
// a task
const everyDay = (data) => {
    return false;
};

const newUser = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('new user');
        }, 100);
    });
};

const vip = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('vip');
        }, 10);
    });
};

// create a SYQueue
let queue = new SYQueue();
// crate a task array
let tasks = [everyDay, newUser, vip];
// find the first resolve task
queue.race(tasks).then(res => {
    // the result is new user
    console.log('queue finished =', res);
}).catch(error => {
    console.log('error = ', error);
});
```

## queue.serial

Run task one by one until all task finish.

```js
// a task
const everyDay = (data) => {
    return false;
};

const newUser = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('new user');
        }, 100);
    });
};

const vip = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('vip');
        }, 10);
    });
};

// create a SYQueue
let queue = new SYQueue();
// crate a task array
let tasks = [everyDay, newUser, vip];
// run task one by one
queue.serial(tasks).then(res => {
    // res {
    //     0: false,
    //     1: new user,
    //     2: vip
    // }
    console.log('queue finished =', res);
}).catch(error => {
    console.log('error = ', error);
});
```

## queue.parallel

Run task parallelly, you can set the value to limit how many task to run. One task will begin run when a task resolve. SYQueue will stop when all tasks finish.

```js
// a task
const everyDay = (data) => {
    return false;
};

const newUser = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('new user');
        }, 100);
    });
};

const vip = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('vip');
        }, 10);
    });
};

// create a SYQueue
let queue = new SYQueue();
// crate a task array
let tasks = [everyDay, newUser, vip];
// only two tasks can run at a time
queue.parallel(tasks, 2).then(res => {
    // res {
    //     0: false,
    //     1: new user,
    //     2: vip
    // }
    console.log('queue finished =', res);
}).catch(error => {
    console.log('error = ', error);
});
```
