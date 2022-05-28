const request = require('request');
const fs = require('fs');
const path = require('path');

async function loadUrl(url) {
    return new Promise((r, j) => {
        const paths = url.split('/');
        const { length } = paths;
        const filename = paths[length - 1];
        const file = filename.slice(filename.length - 12);
        const destDir = path.resolve(__dirname, '../../public/imgs', file);
        let writeStream = fs.createWriteStream(destDir);
        let readerStream = request(url);
        readerStream.pipe(writeStream);
        readerStream.on('error', (err) => {
            console.log('error', err.message);
            writeStream.close();
            j();
        })
        readerStream.on('complete', () => {
            writeStream.end();
            r();
        });
    })
}

function downloadImages(urls) {
    return Promise.all(urls.map(url => loadUrl(url.largeImageURL)));
}

module.exports = {
    downloadImages,
}