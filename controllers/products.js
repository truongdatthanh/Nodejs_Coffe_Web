let categorySchema = require('../schemas/category')
let slugify = require('slugify');
let productSchema = require('../schemas/product')

module.exports = {
    GetAllProducts: async function () {
        let products = await productSchema.find({}).populate('category', 'name');
        let productsExit = products.filter((product) => !product.isDeleted);
        return productsExit;
    },

    GetProductBySlug: async function (cateSlug, productSlug) {
        let category = await productSchema.findOne({ slug: cateSlug });
        let products = await productSchema.find({
            category: category._id,
            slug: productSlug
        })
        return products;
    },

    GetProductById: async function (id) {
        let product = await productSchema.findById(id).populate('category', 'name');
        if (!product) {
            throw new Error("Không tìm thấy sản phẩm nào");
        }
        return product;
    },

    CreateProduct: async function (body) {
        let category = await categorySchema.findOne({ name: body.category });
        let newProduct = new productSchema({
            name: body.name,
            price: body.price ? body.price : 1000,
            quantity: body.quantity ? body.quantity : 1,
            category: category._id,
            description: body.description ? body.description : "",
            imgURL: body.imgURL ? body.imgURL : "",
            slug: slugify(body.name, {
                lower: true
            })
        });
        return await newProduct.save();
    },

    UpdateProduct: async function (id, body) {
        let updatedObj = {}
        if (body.name) {
            updatedObj.name = body.name;
            updatedObj.slug = slugify(body.name, {
                lower: true
            })
        }
        if (body.quantity) {
            updatedObj.quantity = body.quantity
        }
        if (body.price) {
            updatedObj.price = body.price
        }
        if (body.description) {
            updatedObj.description = body.description
        }
        if (body.imgURL) {
            updatedObj.imgURL = body.imgURL
        }
        let updatedProduct = await productSchema.findByIdAndUpdate(id, updatedObj, { new: true });
        return updatedProduct;
    },

    DeleteProduct: async function (id) {
        let deleteProduct = await productSchema.findByIdAndUpdate(id, {
            isDeleted: true
        }, { new: true })
        return deleteProduct;
    }

}