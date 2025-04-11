let mongoose = require('mongoose')

let paymentSchema = mongoose.Schema({
    order: {
        type: mongoose.Types.ObjectId,
        ref: 'order',
    },
    method: {
        type: String,
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