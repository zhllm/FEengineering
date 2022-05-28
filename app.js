// https://pixabay.com/api/?key=19323754-89ce0cee13361c697d0fe73e2&q=yellow+flowers&image_type=photo
const express = require('express');
const request = require('request');
const path = require('path');
const fs = require('fs');
const { downloadImages } = require('./src/utils/utils');
const app = express();
const port = 8112;


app.use('/static', express.static('public'));


app.get('/', (req, res) => {
    request('https://pixabay.com/api/?key=19323754-89ce0cee13361c697d0fe73e2&q=yellow+flowers&image_type=photo', async(err, response, body) => {
        try {
            const imageList = JSON.parse(body).hits;
            let current = 0;
            console.log(imageList.slice(current, current + 5));
            while (current < imageList.length - 1) {
                console.log(imageList.slice(current, current + 5));
                await downloadImages(imageList.slice(current, current + 5));
                current += 10;
            }
        } catch (error) {
            console.log(error);
            res.send(error);
        }
        res.send(JSON.parse(body));
    })
})

app.get('/images', (req, res) => {
    const fileUrl = path.resolve(__dirname, './public/imgs');
    fs.readdir(fileUrl, (err, files) => {
        console.log(files);
        const paths = files.map(file => `http://localhost:3000/static/imgs/${file}`);
        res.send({
            list: paths,
        });
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})