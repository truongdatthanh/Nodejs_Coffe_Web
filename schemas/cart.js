let mongoose = require('mongoose')

let cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
    },
    items: [{
        product: { type: mongoose.Types.ObjectId, ref: 'product' },
        quantity: Number
      }],
}, {
    timestamps: true
})  
module.exports = mongoose.model('cart', cartSchema);