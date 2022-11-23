const { uuid } = require('uuidv4');
const fs = require('fs');
const path = require('path');

const typeFile = [
  'jpeg',
  'png',
  'gif',
  'tiff',
  'psd',
  'pdf',
  'eps',
  'ai',
  'heic',
  'raw',
  'svg',
  'jpg',
];

const image = {
  readSize(base64) {
    let y = 1;
    if (base64.endsWith('==')) y = 2;
    const xSize = base64.length * 0.75 - y;
    return Math.round(xSize / (1024 * 1024));
  },
  isImage(base64) {
    // data:@file/jpeg;base64,/9j/4AAQSkZJRgABAQA
    const file = base64.split(';base64')[0];
    const origin = file.split('/')[1];
    if (origin) return typeFile.includes(origin.toLowerCase());
    return false;
  },
  saveImage(base64, path) {
    const buff = Buffer.from(base64.split('base64,')[1], 'base64');
    const filename = `${uuid() + Date.now()}.jpg`;
    const foldername = `${filename}`;
    fs.writeFileSync(`src/public/img/${path}/${foldername}`, buff);
    return foldername;
  },
  deleteImage(path) {
    const fullPath = `src/public/img/${path}`;
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  }
}

module.exports = image;