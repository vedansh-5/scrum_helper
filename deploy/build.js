const fs = require('fs-extra');
const archiver = require('archiver');
const path = require('path');

async function buildExtension() {
    console.log('Building scrum helper extension');
    const sourceDir = path.join(__dirname, '../src');
    const buildDir = path.join(__dirname, 'build');
    const zipPath = path.join(__dirname, 'scrum-helper.zip');

    try{
        await fs.emptyDir(buildDir);
        console.log("Cleaned build dir");

        await fs.copy(sourceDir, buildDir, {
            filter: (src) => {
                const relativePath = path.relative(sourceDir, src);
                const excluded = [
                    'node_modules',
                    '.git',
                    '.env',
                    // 'tailwind.config.js'
                ];
                return !excluded.some(ex => relativePath.includes(ex));
            }
        });
        console.log('Copied src files');

        // use production manifest
        await fs.copy(
            path.join(__dirname, 'manifest-production.json'),
            path.join(buildDir, 'manifest.json')
        );
        console.log('Applied production manifest');

        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        return new Promise((resolve, reject) => {
            output.on('close', () => {
                console.log(`Extension built: ${archive.pointer()} bytes`);
                console.log(`zip: ${zipPath}`);
                resolve(zipPath);
            });

            archive.on('error', reject);
            archive.pipe(output);
            archive.directory(buildDir, false);
            archive.finalize();
        });

    } catch(err){
        console.error('Build failed: ', err);
        throw err;
    }
}

module.exports = buildExtension

if(require.main === module){
    buildExtension().catch(process.exit);
}