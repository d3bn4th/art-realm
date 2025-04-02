import fs from 'fs';
import https from 'https';

const url = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=300&h=300&fit=crop';
const filePath = 'public/images/default-avatar.jpg';

https.get(url, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download image: ${response.statusCode}`);
    process.exit(1);
  }

  const fileStream = fs.createWriteStream(filePath);
  response.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    console.log('Default avatar downloaded successfully!');
  });

  fileStream.on('error', (err) => {
    fs.unlink(filePath, () => {});
    console.error('Error downloading default avatar:', err);
    process.exit(1);
  });
}).on('error', (err) => {
  console.error('Error downloading default avatar:', err);
  process.exit(1);
}); 