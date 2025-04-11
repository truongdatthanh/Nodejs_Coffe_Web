let mongoose = require('mongoose')
const user = require('./user')

let wishlistSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
    },
    items: [{
        product: { type: mongoose.Types.ObjectId, ref: 'Product' },
        quantity: Number
    }],
}, {
    timestamps: true
})

module.exports = mongoose.model('wishlist', wishlistSchema)