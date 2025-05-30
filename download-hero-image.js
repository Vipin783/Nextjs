const https = require('https');
const fs = require('fs');
const path = require('path');

// Using a high-quality stock image from Pexels
const imageUrl = 'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1';
const fileName = 'hero-background.jpg';

async function downloadImage() {
  const publicDir = path.join(process.cwd(), 'public');
  const filePath = path.join(publicDir, fileName);
  
  // Create public directory if it doesn't exist
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  return new Promise((resolve, reject) => {
    console.log('Downloading hero background image...');
    https.get(imageUrl, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          console.log('✓ Downloaded hero-background.jpg');
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
    }).on('error', (err) => {
      reject(err);
    });
  });
}

downloadImage().catch(console.error); 