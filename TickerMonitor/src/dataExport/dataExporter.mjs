// import mongoose from 'mongoose';
import fs from 'fs';

// mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost:27017/ticker-db");

export const extension = './fileRepository';

export function parseFolderForData() {
  console.log('exporting data files from directory');
  fs.readdir(extension, 'utf8', (err, files) => {
    console.log(files);
    files.forEach(file => exportFile(`${extension}/${file}`));
  })
}
export function exportFile(file) {
  console.log(`exporting File : ${file}`);
  fs.readFile(file, (err, data) => {
    if(err)console.log(err);
    exportToMongo(data.toString());
  });
}

export function exportToMongo(data) {
  console.log(`exporting data to Mongo DB! Data: ${data}`);
}
