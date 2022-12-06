const cluster = require('cluster')
const os = require('os')


class Clusters {
    _currentWorker = ''
    boot_func = null

    constructor(bootstrap, cores = 1) {
        // const numberOfCores = 1;
        if (cluster.isMaster) {

            this.boot_func = bootstrap;
            for (let i = 0; i < cores; ++i) {
                cluster.fork();
            }

            cluster.on('online', (worker) => {
                console.log('Worker ' + worker.process.pid + ' is online');
                this._currentWorker = worker.id
                console.log(this._currentWorker)
            });

            cluster.on('exit', (worker, code, signal) => {
                console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
                console.log('Starting a new worker');

                cluster.fork();
            });

            cluster.on('message', (worker, message) => {
                console.log(message)
                console.log('dasdasdas')
            });

            // for (const id in cluster.workers) {
            //     cluster.workers[id].on('message', (args) => {
            //         console.log('dasd')
            //         this._handle(args)
            //     })
            // }

        } else {
            process.on('message', (msg) => {
                console.log(msg)
                this._handle(msg.args, bootstrap)
            })
            // console.log(cluster.worker.process)
            // if (cluster.worker.current) {
            //     console.log(cluster.worker.id)
            //     bootstrap()
            // }
        }
    }

    _handle(args, func) {
        // console.log(args)
        func(...args)
    }

    run(...args) {
        // console.log(cluster.workers)
        // const idx = cluster.workers.findIndex((w) => w.id === )
        // console.log(idx)

        if (cluster.isMaster) {
            const idxs = Object.keys(cluster.workers)
            const worker_idx = idxs.findIndex((w_id) => w_id === this._currentWorker.toString())
            cluster.workers[this._currentWorker].process.current = true
            if (worker_idx < idxs.length - 1) {
                this._currentWorker = idxs[worker_idx + 1]
            } else {
                this._currentWorker = idxs[0]
            }
            // console.log(cluster.workers[this._currentWorker].process)
            // console.log(this.boot_func)
            cluster.workers[this._currentWorker].send({args})
            // console.log(cluster.worker.process)
        }
        // else if (cluster.isWorker) {
        //     // console.log(cluster.workers)
        //     // console.log(cluster.workers[cluster.worker.id.toString()].process.current)
        //     // if (cluster.workers[cluster.worker.id.toString()].process.current) {
        //     //     console.log(cluster.worker)
        //     //     this.boot_func(args)
        //     // }
        // }
    }
}

// const clusterizator = new Clusters()


module.exports = {Clusters}
