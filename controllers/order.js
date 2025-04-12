let orderSchema = require('../schemas/order')
let userSchema = require('../schemas/user')
let cartSchema = require('../schemas/cart')
let productSchema = require('../schemas/product')
let voucherSchema = require('../schemas/voucher')

module.exports = {
    GetAllOrders: async function (userId) {
        try {
            let user = await userSchema.findById(userId);
            let order = await orderSchema.find({ user: user._id }).populate('user', "username");
            if (!order) {
                throw new Error("Không có đơn hàng nào")
            }
            return order;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    CreateOrder: async function (userId, body) {
        try {
            console.log(body);
            let user = await userSchema.findById(userId);
            let cart = await cartSchema.findOne({ user: user._id }).populate('items.product');
            if (!cart) {
                throw new Error("Giỏ hàng của bạn đang trống")
            }
            const orderItems = cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            }));

            let sumPrice = 0;
            for (let i = 0; i < orderItems.length; i++) {
                let product = await productSchema.findById(orderItems[i].product);
                if (!product) {
                    throw new Error("Sản phẩm không tồn tại")
                }
                sumPrice += product.price * orderItems[i].quantity;
            }

            let voucher = await voucherSchema.findOne({ code: body.discountCode, isActive: true });
            let discountAmount = 0
            if (voucher) {
                if (voucher.maxUses <= voucher.usedCount) {
                    throw new Error("Mã giảm giá đã hết lượt sử dụng")
                }
                if (voucher.expiryDate < Date.now()) {
                    throw new Error("Mã giảm giá đã hết hạn")
                }
                if (voucher.discountType === "percentage") {
                    discountAmount = (sumPrice * voucher.discountValue / 100);
                } else if (voucher.discountType === "fixed") {
                    discountAmount = voucher.discountValue;
                }
                voucher.usedCount += 1;
                await voucher.save();
            }

            let totalPrice = sumPrice - discountAmount;
            if (totalPrice < 0) {
                totalPrice = 0;
            }

            let order = new orderSchema({
                user: user._id,
                items: orderItems,
                totalPrice: totalPrice,
                address: body.address,
                paymentMethod: body.paymentMethod
            });
            
            await order.save();
            return await order.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

}
