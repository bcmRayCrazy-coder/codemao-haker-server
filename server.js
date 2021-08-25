const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios');

let config = JSON.parse(fs.readFileSync('config.json'));

const port = config.port;
var formId = 0;

function updateConfig(update = {}) {
    Object.assign(config, update);
    fs.writeFileSync('config.json', JSON.stringify(config));
};

app.get('/look', (req, res) => {
    res.send(JSON.stringify(config.des));
    res.end();
});

app.get('/keyCheck/:key', (req, res) => {
    var key = req.params.key;
    var canUse = false;
    config.keys.forEach(k => {
        if (k === key) canUse = true;
    });
    res.write(canUse.toString());
    res.end();
});

app.get('/:key/start/:formId', (req, res) => {
    var key = req.params.key;
    var canUse = false;
    config.keys.forEach(k => {
        if (k === key) canUse = true;
    });
    if (canUse) {
        if (config.using) {
            res.write('false');
        } else {
            res.write('true');
            updateConfig({ using: true });
            const s = setInterval(() => {
                axios.get(`https://api.codemao.cn/web/forums/posts/${postID}/details`, {
                    headers: {
                        Host: "api.codemao.cn",
                    }
                })
            }, 105);
            setTimeout(() => {
                clearInterval(s);
                updateConfig({ using: false });
            }, 10000);
        }
    } else {
        res.write('false');
    }
    res.end();
});

app.listen(port, () => console.log('codemao-hacker-server is running!At port ', port));