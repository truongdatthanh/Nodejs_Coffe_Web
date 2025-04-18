let mongoose = require('mongoose');

let orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
    },
    items: [{
        product: { type: mongoose.Types.ObjectId, ref: 'product' },
        quantity: Number
      }],
    totalPrice:{
        type:Number,
        default:0
    },
    address:{
        type:String,
        default:""
    },
    paymentMethod: {
        type: String,
    },
    status:{
        type:String,
        enum:["pending","processing","completed","cancelled"],
        default:"pending"
    },
    discountCode: {
        type: String,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('order', orderSchema)