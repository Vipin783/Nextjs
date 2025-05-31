const fs = require('fs');
const https = require('https');
const path = require('path');

// Events and Documentary photo URLs from Pexels (free to use)
const photos = {
  events: {
    conference: [
      'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
      'https://images.pexels.com/photos/2774555/pexels-photo-2774555.jpeg',
      'https://images.pexels.com/photos/2774554/pexels-photo-2774554.jpeg',
      'https://images.pexels.com/photos/2774553/pexels-photo-2774553.jpeg',
      'https://images.pexels.com/photos/2774552/pexels-photo-2774552.jpeg'
    ],
    festival: [
      'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
      'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
      'https://images.pexels.com/photos/1190299/pexels-photo-1190299.jpeg',
      'https://images.pexels.com/photos/1190300/pexels-photo-1190300.jpeg',
      'https://images.pexels.com/photos/1190301/pexels-photo-1190301.jpeg'
    ],
    concert: [
      'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
      'https://images.pexels.com/photos/1763076/pexels-photo-1763076.jpeg',
      'https://images.pexels.com/photos/1763077/pexels-photo-1763077.jpeg',
      'https://images.pexels.com/photos/1763078/pexels-photo-1763078.jpeg',
      'https://images.pexels.com/photos/1763079/pexels-photo-1763079.jpeg'
    ]
  },
  documentary: {
    nature: [
      'https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg',
      'https://images.pexels.com/photos/247432/pexels-photo-247432.jpeg',
      'https://images.pexels.com/photos/247433/pexels-photo-247433.jpeg',
      'https://images.pexels.com/photos/247434/pexels-photo-247434.jpeg',
      'https://images.pexels.com/photos/247435/pexels-photo-247435.jpeg'
    ],
    culture: [
      'https://images.pexels.com/photos/2106685/pexels-photo-2106685.jpeg',
      'https://images.pexels.com/photos/2106686/pexels-photo-2106686.jpeg',
      'https://images.pexels.com/photos/2106687/pexels-photo-2106687.jpeg',
      'https://images.pexels.com/photos/2106688/pexels-photo-2106688.jpeg',
      'https://images.pexels.com/photos/2106689/pexels-photo-2106689.jpeg'
    ],
    urban: [
      'https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg',
      'https://images.pexels.com/photos/374871/pexels-photo-374871.jpeg',
      'https://images.pexels.com/photos/374872/pexels-photo-374872.jpeg',
      'https://images.pexels.com/photos/374873/pexels-photo-374873.jpeg',
      'https://images.pexels.com/photos/374874/pexels-photo-374874.jpeg'
    ]
  }
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

async function downloadPhotos() {
  for (const [section, categories] of Object.entries(photos)) {
    const baseDir = path.join(process.cwd(), 'public', 'portfolio', section);
    
    // Create directories if they don't exist
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    for (const [category, urls] of Object.entries(categories)) {
      console.log(`Downloading ${category} ${section} photos...`);
      
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
}

downloadPhotos().then(() => {
  console.log('All photos downloaded successfully!');
}).catch(err => {
  console.error('Error downloading photos:', err);
}); 