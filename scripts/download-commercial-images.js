const fs = require('fs');
const https = require('https');
const path = require('path');

// Commercial photo URLs from Pexels (free to use)
const commercialPhotos = {
  corporate: [
    'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
    'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg',
    'https://images.pexels.com/photos/1181394/pexels-photo-1181394.jpeg',
    'https://images.pexels.com/photos/1181304/pexels-photo-1181304.jpeg',
    'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg'
  ],
  product: [
    'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
    'https://images.pexels.com/photos/3780682/pexels-photo-3780682.jpeg',
    'https://images.pexels.com/photos/3780683/pexels-photo-3780683.jpeg',
    'https://images.pexels.com/photos/3780684/pexels-photo-3780684.jpeg',
    'https://images.pexels.com/photos/3780685/pexels-photo-3780685.jpeg'
  ],
  fashion: [
    'https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg',
    'https://images.pexels.com/photos/994524/pexels-photo-994524.jpeg',
    'https://images.pexels.com/photos/994525/pexels-photo-994525.jpeg',
    'https://images.pexels.com/photos/994526/pexels-photo-994526.jpeg',
    'https://images.pexels.com/photos/994527/pexels-photo-994527.jpeg'
  ],
  brand: [
    'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg',
    'https://images.pexels.com/photos/1884582/pexels-photo-1884582.jpeg',
    'https://images.pexels.com/photos/1884583/pexels-photo-1884583.jpeg',
    'https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg',
    'https://images.pexels.com/photos/1884585/pexels-photo-1884585.jpeg'
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

async function downloadCommercialPhotos() {
  const baseDir = path.join(process.cwd(), 'public', 'portfolio', 'commercial');
  
  // Create directories if they don't exist
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  for (const [category, urls] of Object.entries(commercialPhotos)) {
    console.log(`Downloading ${category} commercial photos...`);
    
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

downloadCommercialPhotos().then(() => {
  console.log('All commercial photos downloaded successfully!');
}).catch(err => {
  console.error('Error downloading commercial photos:', err);
}); 