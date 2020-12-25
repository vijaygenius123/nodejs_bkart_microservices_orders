const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/', ((req, res) => {
    res.send("Hello From Orders Microservice");
}));

app.listen(4002, () => {
    console.log("Up & Running! Orders Microservice");
})
