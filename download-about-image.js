const https = require('https');
const fs = require('fs');
const path = require('path');

const imageUrl = 'https://images.pexels.com/photos/2773498/pexels-photo-2773498.jpeg?auto=compress&cs=tinysrgb&w=1200';
const fileName = 'about-image.jpg';

async function downloadImage() {
  const publicDir = path.join(process.cwd(), 'public');
  const filePath = path.join(publicDir, fileName);
  
  // Create public directory if it doesn't exist
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  return new Promise((resolve, reject) => {
    https.get(imageUrl, (response) => {
      if (response.statusCode === 200) {
        console.log('Downloading about section image...');
        response.pipe(fs.createWriteStream(filePath))
          .on('error', reject)
          .once('close', () => {
            console.log('✓ Downloaded about-image.jpg');
            resolve(filePath);
          });
      } else {
        response.resume();
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

downloadImage().catch(console.error); 