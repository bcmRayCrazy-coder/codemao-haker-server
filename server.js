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

app.get('/:key/start/:postId', (req, res) => {
    var key = req.params.key;
    var canUse = config.using;
    var s = setInterval(() => {}, 0);
    config.keys.forEach(k => {
        if (k === key) canUse = true;
    });
    res.status(200);
    res.charset = 'utf-8';
    if (canUse) {
        if (config.using) {
            res.write(JSON.stringify({ err: true, c: "服务器繁忙" }));
        } else {
            res.write(JSON.stringify({ err: false, c: "成功!" }));
            updateConfig({ using: true });
            s = setInterval(() => {
                axios.get(`https://api.codemao.cn/web/forums/posts/${req.params.postID}/details`, {
                    headers: {
                        Host: "api.codemao.cn",
                    }
                }).then(({ data }) => {
                    console.log(data);
                }).catch((err) => {
                    console.error(err);
                })
            }, 105);
        }
    } else {
        res.write(JSON.stringify({ err: true, c: "key错误" }));
    }
    setTimeout(() => {
        clearInterval(s);
        updateConfig({ using: false });
        console.log("timeout!");
    }, 10000);
    res.end();
});

app.listen(port, () => console.log('codemao-hacker-server is running!At port ', port));