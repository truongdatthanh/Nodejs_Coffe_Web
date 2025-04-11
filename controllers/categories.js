let categorySchema = require('../schemas/category')
let productSchema = require('../schemas/product')
let slugify = require('slugify');
module.exports = {
    GetAllCategories: async function () {
        return await categorySchema.find({});
    },

    GetCategoryBySlug: async function (slug) {
        let category = await categorySchema.findOne({ slug: slug });
        if (!category) {
            throw new Error("Không tìm thấy danh mục nào");
        }
        let products = await productSchema.find({ category: category._id });
        if (products.length === 0) {
            throw new Error("Không có sản phẩm nào");
        }
        return products;
    },

    CreateCategory: async function (name, description) {
        let newCategory = new categorySchema({
            name: name,
            description: description,
            slug: slugify(name, {
                lower: true
            })
        });
        return await newCategory.save();
    },

    UpdateCategory: async function (id, name) {
        let updatedObj = {};
        if (name) {
            updatedObj.name = name,
                updatedObj.slug = slugify(name, {
                    lower: true
                })
        }
        let updatedCategory = await categorySchema.findByIdAndUpdate(id, updatedObj, { new: true });
        return updatedCategory;
    },

    DeleteCategory: async function (id) {
        try {
            let category = await categorySchema.findById(id);
            let products = await productSchema.find({ category: category._id });
            if (products) {
                throw new Error("Không thể xóa danh mục này vì nó đang được sử dụng trong sản phẩm khác");
            }
            let deleteCaterogy = await categorySchema.findByIdAndUpdate(id, {
                isDeleted: true
            }, { new: true })
            return deleteCaterogy;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}