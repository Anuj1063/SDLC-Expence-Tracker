const fs = require('fs');
const path = require('path');

const deleteFile = (folderName, fileName) => {
  if (!fileName) return;

  const filePath = path.join(__dirname, '../../', folderName, fileName);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Failed to delete file (${filePath}):`, err);
    } else {
      console.log(`Deleted file: ${filePath}`);
    }
  });
};

module.exports = deleteFile;