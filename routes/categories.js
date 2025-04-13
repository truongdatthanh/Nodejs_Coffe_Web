var express = require('express');
var router = express.Router();
let categorySchema = require('../schemas/category')
let slugify = require('slugify');
const { CreateErrorResponse, CreateSuccessResponse } = require('../utils/responseHandler');
const categoryController = require('../controllers/categories');
const { check_authentication, check_authorization } = require('../utils/check_auth');
const constants = require('../utils/constants');


router.get('/',check_authentication, async function (req, res, next) {
    let categories = await categorySchema.find({});
    if (categories.length === 0) {
        CreateErrorResponse(res, 404, "Không có danh mục nào");
    }
    CreateSuccessResponse(res, 200, categories);
});



router.get('/:slug',check_authentication, async function (req, res, next) {
    try {
        let slug = req.params.slug;
        console.log("abbc", slug);
        if (!slug) {
            console.log("abc", slug);
        }
        let category = await categoryController.GetCategoryBySlug(slug);
        CreateSuccessResponse(res, 200, category);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message)
    }
});


router.post('/',check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
    try {
        let body = req.body;
        let newCategory = await categoryController.CreateCategory(body.name, body.description);
        await newCategory.save()
        CreateSuccessResponse(res, 200, newCategory);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
});


//update
router.put('/:id',check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
    try {
        let body = req.body; 
        let updatedCategory = await categoryController.UpdateCategory(req.params.id, body.name);
        CreateSuccessResponse(res, 200, updatedCategory);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
});


//delete
router.delete('/:id',check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
    try {
        let deleteCategory = await categoryController.DeleteCategory(req.params.id);
        CreateSuccessResponse(res, 200, deleteCategory);
    } catch (error) {
        CreateErrorResponse(res, 400, error.message);
    }
});


module.exports = router;
