const chromeWebstoreUpload = require('chrome-webstore-upload');
const fs = require('fs-extra');
const buildExtension = require('./build');

async function deployExtension() {
    console.log('Starting deployment of scrum helper extension.');

    const config = {
        extensionId: process.env.CHROME_EXTENSION_ID,
        clientId: process.env.CHROME_CLIENT_ID,
        clientSecret: process.env.CHROME_CLIENT_SECRET,
        refreshToken: process.env.CHROME_REFRESH_TOKEN
    };

    const missing = Object.entries(config).filter(([key, value]) => !value).map(([key]) => key);

    if(missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    try{
        // Build the extension
        const zipPath = await buildExtension();

        // Initialeze chrome web store api
        const webstore = chromeWebstoreUpload(config);

        // Upload
        console.log('Uploading extension to Chrome Web Store...');
        const uploadResponse = await webstore.uploadExisting(fs.createReadStream(zipPath));

        if(uploadResponse.uploadState !== 'SUCCESS') {
            throw new Error(`Upload failed: ${JSON.stringify(uploadResponse.uploadState)}`);
        }
        console.log('Upload successful!');

        // Publish
        console.log('Publishing extension...');
        const publishResponse = await webstore.publish();

        if(publishResponse.status.includes('OK')) {
            console.log('Extension published successfully!');
            console.log(`View it here: https://chrome.google.com/webstore/detail/${config.extensionId}`);
        } else {
            console.warn('Publish completed with warnings:', publishResponse);
        }

        // cleanup
        await fs.unlink(zipPath);
        console.log('Cleanup completed, zip file removed.');
    } catch(err) {
        console.error('Deployment failed:', err);
        throw err;
    }
}
module.exports = deployExtension;

if(require.main === module) {
    deployExtension().catch(() => process.exit(1));
}
// This script deploys the Chrome extension to the Chrome Web Store.