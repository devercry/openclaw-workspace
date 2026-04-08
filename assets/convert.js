import sharp from 'sharp';
import { readFileSync } from 'fs';

const svg = readFileSync('optical-platform-hero.svg');

await sharp(svg)
  .png()
  .toFile('optical-platform-hero.png')
  .then(() => console.log('✅ PNG generated: optical-platform-hero.png'))
  .catch(err => console.error('Error:', err));
