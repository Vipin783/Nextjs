const https = require('https');
const fs = require('fs');
const path = require('path');

// Using a reliable CDN-hosted video
const videoUrl = 'https://cdn.coverr.co/videos/coverr-aerial-view-of-beach-resort-2633/1080p.mp4';
const fileName = 'hero-background.mp4';

async function downloadVideo() {
  const publicDir = path.join(process.cwd(), 'public');
  const filePath = path.join(publicDir, fileName);
  
  // Create public directory if it doesn't exist
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  return new Promise((resolve, reject) => {
    console.log('Downloading hero background video...');
    const request = https.get(videoUrl, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          console.log('✓ Downloaded hero-background.mp4');
          resolve(filePath);
        });

        fileStream.on('error', (err) => {
          fs.unlink(filePath, () => {
            reject(err);
          });
        });
      } else {
        response.resume();
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
      }
    });

    request.on('error', (err) => {
      reject(err);
    });

    // Set a timeout of 30 seconds
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Request timeout after 30 seconds'));
    });
  });
}

downloadVideo().catch(console.error); 