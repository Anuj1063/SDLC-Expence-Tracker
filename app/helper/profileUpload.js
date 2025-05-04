const multer = require("multer");
const path = require("path");
const fs = require("fs");

class ProfileUploader {
  constructor({
    folderName = "uploads/profile",
    supportedFiles = ["image/jpeg", "image/png", "image/jpg"],
    fieldSize = 1024 * 1024 * 2,
  }) {
    this.folderName = folderName;
    this.supportedFiles = supportedFiles;
    this.fieldSize = fieldSize;

    // Check if the folder exists, if not, create it
    if (!fs.existsSync(this.folderName)) {
      fs.mkdirSync(this.folderName, { recursive: true }); // recursive: true ensures that any missing parent directories are created as well
    }
  }

  // Set up storage configuration
  storage() {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        
        cb(null, this.folderName);
      },
      filename: (req, file, cb) => {
        let ext = path.extname(file.originalname); //to find the extension of a file
        cb(null, Date.now() + "AM" + ext); //unique name creation
      },
    });
  }

  // Set up file filter to only accept the supported file types
  fileFilter() {
    return (req, file, callback) => {
      if (this.supportedFiles.includes(file.mimetype)) {
        callback(null, true);
      } else {
        console.log(
          `Please select a valid file format. Supported formats are: ${this.supportedFiles.join(
            ", "
          )}`
        );
        callback(null, false);
      }
    };
  }

  // Return the multer configuration with dynamic options
  upload() {
    return multer({
      storage: this.storage(),
      fileFilter: this.fileFilter(),
      limits: {
        fileSize: this.fieldSize, // Limits the file size
      },
    });
  }
}

module.exports = ProfileUploader; // Export the class itself







