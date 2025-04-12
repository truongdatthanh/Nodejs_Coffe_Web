let paymentSchema = require('../schemas/payment');
let cartSchema = require('../schemas/cart'); // Assuming you have a cart schema

module.exports = {
    CreatePayment: async function (cartId, body) {
        // Retrieve cart details
        let cart = await cartSchema.findById(cartId).populate('items.product');
        if (!cart) {
            throw new Error('Cart not found');
        }

        // Calculate total amount
        let totalAmount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        // Create payment
        let newPayment = new paymentSchema({
            amount: totalAmount,
            currency: body.currency || 'USD',
            status: body.status || 'pending',
            orderId: body.orderId,
            paymentMethod: body.paymentMethod
        });

        return await newPayment.save();
    },

    GetPaymentById: async function (id) {
        return await paymentSchema.findById(id);
    },

    GetAllPayments: async function () {
        return await paymentSchema.find({});
    }
};