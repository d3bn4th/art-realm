import fs from 'fs';
import path from 'path';
import https from 'https';

const profileImages = {
  'vincent.jpg': 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=300&h=300&fit=crop',
  'frida.jpg': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&h=300&fit=crop',
  'john.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&fit=crop',
  'sarah.jpg': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&h=300&fit=crop',
};

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const filePath = path.join(process.cwd(), 'public', 'images', 'profiles', filename);
      const fileStream = fs.createWriteStream(filePath);

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
};

const downloadAllImages = async () => {
  try {
    const downloads = Object.entries(profileImages).map(([filename, url]) =>
      downloadImage(url, filename)
    );
    await Promise.all(downloads);
    console.log('All profile images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
    process.exit(1);
  }
};

downloadAllImages(); 