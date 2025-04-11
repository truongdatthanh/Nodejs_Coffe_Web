let cartSchema = require('../schemas/cart')
let userSchema = require('../schemas/user');
let productSchema = require('../schemas/product')

module.exports = {
    GetCart: async function (userId) {
        try {
            let user = await userSchema.findById(userId);
            let cart = await cartSchema.findOne({ user: user._id }).populate('items.product')
            if (!cart) {
                throw new Error("Giỏ hàng của bạn đang trống")
            }
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    AddToCart: async function (userId, body) {
        try {
            console.log(body.items[0].product);
            let user = await userSchema.findById(userId);
            let cart = await cartSchema.findOne({ user: user._id });
            let product = await productSchema.findOne({ name: body.items[0].product });
            if (!cart) {
                cart = new cartSchema({
                    user: user._id,
                    items: [{ product: product._id, quantity: body.items[0].quantity }]
                });
                return await cart.save();
            }
            let itemIndex = cart.items.findIndex((item) =>  item.product.toString() === product._id.toString());
            console.log(itemIndex);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity +=body.items[0].quantity;
            } else {
                cart.items.push({
                    product: product._id,
                    quantity: body.items[0].quantity
                });
            }
            return await cart.save();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // RemoveFromCart: async function (userId, body) {
    //     try {
    //         let user = await userSchema.findById(userId);
    //         let cart = await cartSchema.findOne({ user: user._id });
    //         if (!cart) {
    //             throw new Error("Giỏ hàng không tồn tại")
    //         }
    //         let itemIndex = cart.items.findIndex((item) => item.product.toString() === body.productId);
    //         if (itemIndex > -1) {
    //             cart.items[itemIndex].quantity -= body.quantity;
    //             if (cart.items[itemIndex].quantity <= 0) {
    //                 cart.items.splice(itemIndex, 1);
    //             }
    //         } else {
    //             throw new Error("Sản phẩm không có trong giỏ hàng")
    //         }
    //         await cart.save();
    //     } catch (error) {
    //         throw new Error(error.message);
    //     }
    // },

    RemoveFromCart: async function (userId, productId) {
        try {
            let user = await userSchema.findById(userId);
            let cart = await cartSchema.findOne({ user: user._id });
            if (!cart) {
                throw new Error("Giỏ hàng không tồn tại")
            }
            cart.items = cart.items.filter(item => item.product.toString() !== productId);
            await cart.save();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    ClearCart: async function (userId) {
        try {
            let user = await userSchema.findById(userId);
            let cart = await cartSchema.findOne({ user: user._id });
            cart.items = [];
            await cart.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

}