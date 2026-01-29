const https = require('https');
const { performance } = require('perf_hooks');

const url = 'http://localhost:5000/api/courses';

console.log(`Checking speed for ${url}...`);

const start = performance.now();

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        const end = performance.now();
        const duration = (end - start).toFixed(2);
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Data Size: ${data.length} bytes`);
        console.log(`Total Time: ${duration} ms (${(duration / 1000).toFixed(2)} s)`);
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
