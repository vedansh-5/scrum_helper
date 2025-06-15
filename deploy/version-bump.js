const fs = require('fs-extra');
const path = require('path');

async function bumpVersion(type = 'patch') {
    const manifestPath = path.join(__dirname, '../src/manifest.json');
    const manifest = await fs.readJson(manifestPath);

    const version = manifest.version.split('.').map(Number);

    switch(type) {
        case 'major':
            version[0]++;
            version[1] = 0;
            version[2] = 0;
            break;
        case 'minor':
            version[1]++;
            version[2] = 0;
            break;
        case 'patch':
        default:
            version[2]++;
            break;
    }

    manifest.version = version.join('.');
    await fs.writeJson(manifestPath, manifest, { spaces: 2 });

    console.log(`Version bumped to ${manifest.version}`);
    return manifest.version;
}

module.exports = bumpVersion;

if(require.main === module) {
    const type = process.argv[2] || 'patch';
    bumpVersion(type).catch(console.error);
}