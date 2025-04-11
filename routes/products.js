var express = require('express');
var router = express.Router();
let productController = require('../controllers/products')
let slugify = require('slugify');
const { CreateErrorResponse, CreateSuccessResponse } = require('../utils/responseHandler');

router.get('/', async function (req, res, next) {
    try {
        let products = await productController.GetAllProducts();
        if (products.length === 0) {
            throw new Error("Không có sản phẩm nào")
        }
        CreateSuccessResponse(res, 200, products)
    } catch (error) {
        CreateErrorResponse(res, 404, error.message)
    }
});

router.get('/:category/:product', async function (req, res, next) {
    try {
        let category = req.params.category;
        let product = req.params.product;
        let products = await productController.GetProductBySlug(category, product);
        CreateSuccessResponse(res, 200, products)
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
});

router.post('/', async function (req, res, next) {
    try {
        let body = req.body;
        let newProduct = await productController.CreateProduct(body);
        CreateSuccessResponse(res, 200, newProduct);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        let body = req.body;
        let updatedProduct = await productController.UpdateProduct(req.params.id, body);
        CreateSuccessResponse(res, 200, updatedProduct);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        let deletedProduct = await productController.DeleteProduct(req.params.id);
        CreateSuccessResponse(res, 200, deletedProduct);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
});


module.exports = router;
