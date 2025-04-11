var express = require('express');
var router = express.Router();
let categorySchema = require('../schemas/category')
let slugify = require('slugify');
const { CreateErrorResponse, CreateSuccessResponse } = require('../utils/responseHandler');
const categoryController = require('../controllers/categories')

//get all
router.get('/', async function (req, res, next) {
    let categories = await categorySchema.find({});
    if (categories.length === 0) {
        CreateErrorResponse(res, 404, "Không có danh mục nào");
    }
    CreateSuccessResponse(res, 200, categories);
});


//get slug cate
router.get('/:slug', async function (req, res, next) {
    try {
        let category = await categoryController.GetCategoryBySlug(req.params.slug);
        CreateSuccessResponse(res, 200, category);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message)
    }
});

//create
router.post('/', async function (req, res, next) {
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
router.put('/:id', async function (req, res, next) {
    try {
        let body = req.body; 
        let updatedCategory = await categoryController.UpdateCategory(req.params.id, body.name);
        CreateSuccessResponse(res, 200, updatedCategory);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
});


//delete
router.delete('/:id', async function (req, res, next) {
    try {
        let deleteCategory = await categoryController.DeleteCategory(req.params.id);
        CreateSuccessResponse(res, 200, deleteCategory);
    } catch (error) {
        CreateErrorResponse(res, 400, error.message);
    }
});


module.exports = router;
