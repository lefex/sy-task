/**
 * @file queue.test.ts
 * @author suyan
 * @description to test queue
 * @document https://www.jestjs.cn/docs/getting-started
 */

import SYQueue from '../src/queue';

test('new SYQueue with data.name equal suyan', () => {
    let data = {
        name: 'suyan'
    };
    let queue = new SYQueue(data);
    expect(queue.data.name).toBe('suyan');
});

test('queue race', () => {
    const everyDay = () => {
        return false;
    };
    const newUser = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('new user');
            }, 10);
        });
    };
    const vip = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('vip');
            }, 5);
        });
    };
    let data = {
        queueName: 'race'
    };
    const queue = new SYQueue(data);
    const tasks = [everyDay, newUser, vip];
    return queue.race(tasks).then(res => {
        expect(res).toBe('new user');
        expect(data.queueName).toBe('race');
    });
});

test('queue race one task', () => {
    const vip = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('vip');
            }, 1);
        });
    };
    const queue = new SYQueue();
    const tasks = [vip];
    return queue.race(tasks).then(res => {
        expect(res).toBe('vip');
    });
});

test('queue serial', () => {
    const everyDay = () => {
        return 'every day';
    };
    const newUser = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('new user');
            }, 10);
        });
    };
    const vip = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('vip');
            }, 5);
        });
    };
    let data = {
        queueName: 'serial'
    };
    const queue = new SYQueue(data);
    const tasks = [everyDay, newUser, vip];
    return queue.serial(tasks).then(res => {
        expect(res[0]).toBe('every day');
        expect(res[1]).toBe('new user');
        expect(res[2]).toBe('vip');
        expect(res.queueName).toBe('serial');
    });
});

test('queue parallel', () => {
    const everyDay = () => {
        return 'every day';
    };
    const newUser = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('new user');
            }, 10);
        });
    };
    const vip = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('vip');
            }, 5);
        });
    };
    let data = {
        queueName: 'parallel'
    };
    const queue = new SYQueue(data);
    const tasks = [everyDay, newUser, vip];
    return queue.parallel(tasks, 2).then(res => {
        console.log(res);
        expect(res[0]).toBe('every day');
        expect(res[1]).toBe('new user');
        expect(res[2]).toBe('vip');
        expect(res.queueName).toBe('parallel');
    });
});

test('queue parallel one task, limit > task.length', () => {
    const newUser = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('new user');
            }, 1);
        });
    };
    const queue = new SYQueue();
    const tasks = [newUser];
    return queue.parallel(tasks, 2).then(res => {
        console.log(res);
        expect(res[0]).toBe('new user');
    });
});

test('queue parallel one task, limit <= task.length', () => {
    const newUser = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('new user');
            }, 1);
        });
    };
    const queue = new SYQueue();
    const tasks = [newUser];
    return queue.parallel(tasks, 1).then(res => {
        console.log(res);
        expect(res[0]).toBe('new user');
    });
});