const { google } = require('googleapis');
const readline = require('readline');

// Replace these with your OAuth creds
const CLIENT_ID = 'REPLACE-WITH-YOUR-CLIENT-ID';
const CLIENT_SECRET = 'REPLACE-WITH-YOUR-CLIENT-SECRET';
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/chromewebstore']
});

console.log('Admin: open this URL in your browser: ', authUrl);
console.log('\n after auth, enter the code below: ');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the autorization code: ', async (code) => {
    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log('\n Success! Add these to GitHub Secrets:');
        console.log('CHROME_CLIENT_ID=' + CLIENT_ID);
        console.log('CHROME_CLIENT_SECRET=' + CLIENT_SECRET);
        console.log('CHROME_REFRESH_TOKEN=' + tokens.refresh_token);
        console.log('CHROME_EXTENSION_ID=<get-from-webstore>');
    } catch (error){
        console.error('Error: ', error);
    }
    rl.close();
});
