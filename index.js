const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const {Order} = require('./Order');

const app = express();

const CUSTOMERS_SERVICE_URL = 'http://localhost:4001'
const BOOKS_SERVICE_URL = 'http://localhost:4000'

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

app.get("/order/:id", (req, res) => {
    Order.findById(req.params.id)
        .then(order => {
            if(order){
                axios(`${CUSTOMERS_SERVICE_URL}/customer/${order.customerId}`).then(response => {
                        const customerObject = {customerName : response.data.name};
                        axios(`${BOOKS_SERVICE_URL}/book/${order.bookId}`).then(response => {
                            const bookObject = {bookName : response.data.title};

                            const orderObject = {
                                id: order._id,
                                createdAt: order.createdAt,
                                ...bookObject,
                                ...customerObject
                            }
                            res.json(orderObject)
                        })
                    })
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => {
            throw err
        })
})

app.listen(4002, () => {
    console.log("Up & Running! Orders Microservice");
})
