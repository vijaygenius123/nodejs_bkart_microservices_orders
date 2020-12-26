const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {Order} = require('./Order');

const app = express();

mongoose.connect("mongodb+srv://orders_user:orders_password@cluster0.cbckc.mongodb.net/orders?retryWrites=true&w=majority",
    {useUnifiedTopology: true},
    () => {
        console.log("DB Is Connected");
    })

app.use(bodyParser.json());

app.get('/', ((req, res) => {
    res.send("Hello From Orders Microservice");
}));


app.post('/orders', (req, res) => {
    const newOrder = {
        customerId: mongoose.Types.ObjectId(req.body.customerId),
        bookId: mongoose.Types.ObjectId(req.body.bookId),
        createdAt: new Date()
    }

    const order = new Order(newOrder);

    order.save()
        .then((order) => {
            console.log("Order Created");
            res.json(order)
        }).catch(err => {
        throw err;
    })
})

app.get("/orders", ((req, res) => {
    Order.find()
        .then(books => {
            res.json(books)
        })
        .catch(err => {
            throw  err
        })
}))

app.listen(4002, () => {
    console.log("Up & Running! Orders Microservice");
})
