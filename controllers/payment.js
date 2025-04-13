let paymentSchema = require('../schemas/payment');
let orderSchema = require('../schemas/order');
let cartSchema = require('../schemas/cart');
let userSchema = require('../schemas/user');
module.exports = {
    CreatePayment: async function (userId, body) {
        try {
            let user = await userSchema.findById(userId);
            let order = await orderSchema.findOne({ user: user._id, status: 'pending' });
            if (body.method === "COD") {
                let payment = new paymentSchema({
                    order: order._id,
                    method: body.method,
                    amount: order.totalPrice,
                });
                await payment.save();
                await orderSchema.findByIdAndUpdate(order._id, { status: 'completed' }, { new: true });
                let cart = await cartSchema.findOne({ user: user._id });
                if (cart) {
                    cart.status = "completed";
                    await cart.save();
                }
                return payment;
            }
            if (method === "MOMO") {
                // Call momo payment api here
            }
            if (method === "VNPAY") {
                // Call vnpay payment api here
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    },
};