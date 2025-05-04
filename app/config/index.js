module.exports = {
    // Define application configuration
    appRoot: {
        env: process.env.NODE_ENV || "development",
        isProd: process.env.NODE_ENV === "production",
        host: process.env.HOST || "localhost",
        port: process.env.PORT || 3011,
        appName: process.env.APP_NAME || "Expension",
        getApiFolderName: process.env.API_FOLDER_NAME || "api",
        getUserFolderName: process.env.USER_FOLDER_NAME || "user",
    },
};
