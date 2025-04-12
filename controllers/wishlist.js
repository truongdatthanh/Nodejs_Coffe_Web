let wishlistSchema = require('../schemas/wishlist');
let productSchema = require('../schemas/product');
let userSchema = require('../schemas/user');

module.exports = {
    GetWishlistByUser: async function (userId) {
        try {
            return await wishlistSchema.findOne({ user: userId }).populate('items.product');
        } catch (error) {
            throw new Error('Không thể lấy wishlist: ' + error.message);
        }
    },

    AddToWishlist: async function (userId, body) {
        try {
            let wishlist = await wishlistSchema.findOne({ user: userId });
            let product = await productSchema.findOne({ name: body.items[0].product });
            if (!wishlist) {
                wishlist = new wishlistSchema({
                    user: userId,
                    items: [{ product: product._id, quantity: 1 }]
                });
                return await wishlist.save();
            } else {
                const existingItem = wishlist.items.find((item) => item.product.toString() === product._id.toString());
                if (!existingItem) {
                    wishlist.items.push({ product: product._id, quantity: 1 });
                }
            }
            return await wishlist.save();
        } catch (error) {
            throw new Error('Không thể thêm vào wishlist: ' + error.message);
        }
    },

    RemoveFromWishlist: async function (userId, body) {
        try {
            let wishlist = await wishlistSchema.findOne({ user: userId });
            let product = await productSchema.findOne({ name: body.product });
            if (!wishlist) throw new Error('Không tìm thấy wishlist');
            wishlist.items = wishlist.items.filter(item => item.product.toString() !== product._id.toString());
            return await wishlist.save();
        } catch (error) {
            throw new Error('Không thể xóa khỏi wishlist: ' + error.message);
        }
    }
}
