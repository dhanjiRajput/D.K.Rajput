const cluster = require('cluster');
const os = require('os');
const express = require('express');
const morgan = require('morgan');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`🧠 Master ${process.pid} is running`);
    console.log(`📢 Forking ${numCPUs} workers...\n`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Optional: Listen for worker exit
    cluster.on('exit', (worker, code, signal) => {
        console.log(`⚠️ Worker ${worker.process.pid} died. Starting a new one...`);
        cluster.fork();
    });

} else {
    // Worker processes have their own servers
    const app = express();
    app.use(morgan('dev'));

    app.get('/', (req, res) => {
        // Simulate heavy CPU task
        for (let i = 0; i < 1e9; i++) {}

        res.send(`Handled by process ${process.pid} - Welcome to the future.....`);
    });

    const PORT = 3002;
    app.listen(PORT, () => {
        console.log(`🚀 Worker ${process.pid} started on port ${PORT}`);
    });
}
