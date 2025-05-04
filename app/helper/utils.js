// Core module
const { stat, readdir } = require("fs/promises");
const { join } = require("path");

// Define an object called Utils to hold utility methods
const utils = {
    isDirectory: async (filePath) => {
        const fileStats = await stat(filePath); // Get file/directory stats

        return fileStats.isDirectory(); // Check if the path is a directory
    },

    _readdir: async (filePath) => {
        // Read the contents of the directory specified by 'filePath'
        const files = await readdir(filePath);

        // Process each file/directory in the 'files' array
        const fileDetails = await Promise.all(
            files.map(async (file) => {
                const fullPath = join(filePath, file); // Get the full path of the file/directory

                // Check if the fullPath is a directory
                const isDir = await utils.isDirectory(fullPath);

                // If it's a directory, recursively call _readdir; otherwise, return the file path
                if (isDir) {
                    return utils._readdir(fullPath); // Recursive call for directories
                } else {
                    return fullPath; // Return the file path for files
                }
            })
        );

        // Flatten the array of arrays into a single array and return
        return fileDetails.flat();
    },
};

// Export the Utils object for use in other modules
module.exports = utils;

// Note: utils object exxport array of route file path.
// Example: ["src/routes/auth.js", "src/routes/user.js"]
