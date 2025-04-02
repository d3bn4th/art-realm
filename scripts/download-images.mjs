import fs from 'fs';
import path from 'path';
import https from 'https';

const artworkImages = {
  'starry-night': 'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
  'self-portrait': 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9',
  'ocean-plastic': 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5',
  'forest-rebirth': 'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
  'solar-winds': 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0',
  'biodegradable-beauty': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946',
  'digital-forest': 'https://images.unsplash.com/photo-1511497584788-876760111969',
  'upcycled-dreams': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
  'natures-palette': 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07',
  'sustainable-horizons': 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e'
};

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(process.cwd(), 'public', 'images', 'artworks', `${filename}.jpg`);
    const fileStream = fs.createWriteStream(filepath);

    https.get(`${url}?w=800&q=80`, (response) => {
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
};

async function downloadAllImages() {
  try {
    // Create directory if it doesn't exist
    const dir = path.join(process.cwd(), 'public', 'images', 'artworks');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Download all images
    for (const [filename, url] of Object.entries(artworkImages)) {
      await downloadImage(url, filename);
    }
    
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

downloadAllImages(); 