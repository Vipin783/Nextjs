const fs = require('fs');
const https = require('https');
const path = require('path');

// Wedding photo URLs from Pexels (free to use)
const weddingPhotos = {
  wedding: [
    'https://images.pexels.com/photos/1456613/pexels-photo-1456613.jpeg',
    'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
    'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
    'https://images.pexels.com/photos/1589216/pexels-photo-1589216.jpeg',
    'https://images.pexels.com/photos/2253842/pexels-photo-2253842.jpeg'
  ],
  indian: [
    'https://images.pexels.com/photos/4552397/pexels-photo-4552397.jpeg',
    'https://images.pexels.com/photos/4552396/pexels-photo-4552396.jpeg',
    'https://images.pexels.com/photos/4552395/pexels-photo-4552395.jpeg',
    'https://images.pexels.com/photos/4552394/pexels-photo-4552394.jpeg',
    'https://images.pexels.com/photos/4552393/pexels-photo-4552393.jpeg'
  ],
  beach: [
    'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg',
    'https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg',
    'https://images.pexels.com/photos/169196/pexels-photo-169196.jpeg',
    'https://images.pexels.com/photos/169195/pexels-photo-169195.jpeg',
    'https://images.pexels.com/photos/169192/pexels-photo-169192.jpeg'
  ]
};

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    });
  });
};

async function downloadWeddingPhotos() {
  const baseDir = path.join(process.cwd(), 'public', 'portfolio', 'wedding');
  
  // Create directories if they don't exist
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  for (const [category, urls] of Object.entries(weddingPhotos)) {
    console.log(`Downloading ${category} wedding photos...`);
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const filename = `${category}${i + 1}.jpg`;
      const filepath = path.join(baseDir, filename);
      
      try {
        await downloadImage(url, filepath);
        console.log(`Downloaded: ${filename}`);
      } catch (err) {
        console.error(`Error downloading ${filename}:`, err.message);
      }
    }
  }
}

downloadWeddingPhotos().then(() => {
  console.log('All wedding photos downloaded successfully!');
}).catch(err => {
  console.error('Error downloading wedding photos:', err);
}); 