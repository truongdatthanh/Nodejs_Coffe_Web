let mongoose = require('mongoose')

let paymentSchema = mongoose.Schema({
    order: {
        type: mongoose.Types.ObjectId,
        ref: 'order',
    },
    method: {
        type: String,
    },
    amount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },transactionId: {
        type: String,
    },
   
   
}, {
    timestamps: true
})

module.exports = mongoose.model('payment', paymentSchema)