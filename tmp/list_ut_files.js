const https = require('https');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const tokenMatch = envContent.match(/UPLOADTHING_TOKEN=['"]?([^'"]+)['"]?/);
if (!tokenMatch) {
    console.error('UPLOADTHING_TOKEN not found in .env.local');
    process.exit(1);
}
const token = tokenMatch[1];

async function listFiles() {
    const data = JSON.stringify({
        limit: 100
    });

    const options = {
        hostname: 'uploadthing.com',
        port: 443,
        path: '/api/listFiles',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Uploadthing-Api-Key': JSON.parse(Buffer.from(token, 'base64').toString()).apiKey,
            'X-Uploadthing-Version': '6.4.0'
        }
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log(body);
            } else {
                console.error(`Error: ${res.statusCode}`, body);
            }
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });

    req.write(data);
    req.end();
}

listFiles();
