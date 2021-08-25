const config = require('config.json');
console.log(config);

const express = require('express');
const app = express();
const port = 356;

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => console.log('codemao-hacker-server is running!At port ', port));