let mongoose = require('mongoose')

let reviewSchema = mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'product',
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        default: "",
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('review', reviewSchema)