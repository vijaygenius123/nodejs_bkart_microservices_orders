const mongoose = require('mongoose');

const Order = mongoose.model("Order", {
    customerId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    bookId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        require: true
    },
    deliveredOn: {
        type: Date,
        required: false
    }
})

module.exports = {Order}

