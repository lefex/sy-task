import Queue from './queue.js';

export const queue = {
    everyDay(data) {
        console.log('everyDay called', data);
        return 'every day';
    },
    newUser(data) {
        console.log('new user called', data);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('new user');
            }, 100);
        });
    },
    vip(data) {
        console.log('vip called', data);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('vip');
            }, 10);
        });
    },
    sign(data) {
        console.log('sign called', data);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('sign');
            }, 150);
        });
    },
    login(data) {
        console.log('login called', data);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('login');
            }, 50);
        });
    },
    run() {
        let queue = new Queue();
        let tasks = [this.everyDay, this.newUser, this.vip];
        // queue.race(tasks).then(res => {
        //     console.log('queue finished =', res);
        // }).catch(error => {
        //     console.log('error = ', error);
        // });

        // queue.serial(tasks).then(res => {
        //     console.log('serial queue finished =', res);
        // }).catch(error => {
        //     console.log('serial queue error = ', error);
        // });

        queue.parallel(tasks, 2).then(res => {
            console.log('parallel queue finished =', res);
        }).catch(error => {
            console.log('parallel queue error = ', error);
        });
    }
};
