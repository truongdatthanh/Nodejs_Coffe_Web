let cartSchema = require('../schemas/cart')
let userSchema = require('../schemas/user');
let productSchema = require('../schemas/product')

module.exports = {
    GetCart: async function (userId) {
        try {
            let user = await userSchema.findById(userId);
            let cart = await cartSchema.findOne({ user: user._id, status: "active" }).populate('items.product')
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
            console.log(body.name);
         
            let user = await userSchema.findById(userId);
            let cart = await cartSchema.findOne({ user: user._id, status: "active" });
            let product = await productSchema.findOne({ name: body.name });
            if (!cart) {
                cart = new cartSchema({
                    user: user._id,
                    items: [{ product: product._id, quantity: body.quantity }]
                });
                return await cart.save();
            }
            let itemIndex = cart.items.findIndex((item) => item.product.toString() === product._id.toString());
            console.log(itemIndex);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += body.quantity;
            } else {
                cart.items.push({
                    product: product._id,
                    quantity: body.quantity
                });
            }
            return await cart.save();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    UpdateCart: async function (userId, body) {
        try {
            let user = await userSchema.findById(userId);
            let cart = await cartSchema.findOne({ user: user._id, status: "active" });

            if (!cart) {
                throw new Error("Không tìm thấy giỏ hàng");
            }

            cart.items = body.items;  
            return await cart.save();
        } catch (error) {
            throw new Error(error.message);
        }
    },
    


    RemoveFromCart: async function (userId, productId) {
        try {
            let user = await userSchema.findById(userId);
            let cart = await cartSchema.findOne({ user: user._id, status: "active" });
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
            let cart = await cartSchema.findOne({ user: user._id, status: "active" });
            cart.items = [];
            await cart.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

}