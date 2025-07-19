const autocannon = require('autocannon');

const urls = ['http://localhost:3000', 'http://localhost:3000/stress-test'];
const duration = 30;

async function runTest(url) {
    return new Promise((resolve, reject) => {
        autocannon({ url, duration }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                console.log(`URL: ${url}`);
                console.log("Total Number of requests",result.requests.total);
                console.log("Total Duration",result.duration);
                resolve();
            }
        });
    });
}

(async () => {
    for (const url of urls) {
        try {
            await runTest(url);
        } catch (err) {
            console.error('Error:', err);
        }
    }
})();