const https = require('https');
const fs = require('fs');
const path = require('path');

const portfolioImages = [
  { 
    name: 'wedding.jpg',
    url: 'https://images.pexels.com/photos/1589818/pexels-photo-1589818.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    name: 'commercial.jpg',
    url: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    name: 'event.jpg',
    url: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    name: 'music.jpg',
    url: 'https://images.pexels.com/photos/2747446/pexels-photo-2747446.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    name: 'documentary.jpg',
    url: 'https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    name: 'corporate.jpg',
    url: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    name: 'wedding-2.jpg',
    url: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    name: 'fashion.jpg',
    url: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    name: 'concert.jpg',
    url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    name: 'festival.jpg',
    url: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    name: 'nature-doc.jpg',
    url: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    name: 'product-launch.jpg',
    url: 'https://images.pexels.com/photos/7679644/pexels-photo-7679644.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    name: 'wedding-3.jpg',
    url: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    name: 'conference.jpg',
    url: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    name: 'brand.jpg',
    url: 'https://images.pexels.com/photos/3182833/pexels-photo-3182833.jpeg?auto=compress&cs=tinysrgb&w=1200'
  }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath));
      } else {
        response.resume();
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
};

async function downloadAllImages() {
  const portfolioDir = path.join(process.cwd(), 'public', 'portfolio');
  
  // Create directories if they don't exist
  if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
    fs.mkdirSync(path.join(process.cwd(), 'public'));
  }
  if (!fs.existsSync(portfolioDir)) {
    fs.mkdirSync(portfolioDir);
  }

  // Delete existing images first
  const existingFiles = fs.readdirSync(portfolioDir);
  for (const file of existingFiles) {
    fs.unlinkSync(path.join(portfolioDir, file));
  }

  console.log('Downloading new trending images...');
  
  for (const image of portfolioImages) {
    const filepath = path.join(portfolioDir, image.name);
    try {
      await downloadImage(image.url, filepath);
      console.log(`✓ Downloaded ${image.name}`);
      // Add a small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.error(`✗ Error downloading ${image.name}:`, err.message);
    }
  }
}

downloadAllImages().then(() => console.log('✨ All images downloaded successfully!')); 