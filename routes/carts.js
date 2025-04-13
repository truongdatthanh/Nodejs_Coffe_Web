let cartController = require('../controllers/carts')
let express = require('express');
let router = express.Router();
let { CreateErrorResponse, CreateSuccessResponse } = require('../utils/responseHandler');
const { check_authentication } = require('../utils/check_auth');

router.get('/',check_authentication, async function (req, res, next) {
    try {
        let userId = req.user._id;
        let carts = await cartController.GetCart(userId);
        CreateSuccessResponse(res, 200, carts);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
});

router.post('/',check_authentication, async function (req, res, next) {
    try {
        let userId = req.user._id;
        let body = req.body;
        console.log(body);
        let cart = await cartController.AddToCart(userId, body);
        CreateSuccessResponse(res, 200, cart);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
});

router.delete('/:id',check_authentication, async function (req, res, next) {
    try {
        let userId = req.user._id;
        let productId = req.params.id;
        await cartController.RemoveFromCart(userId, productId);
        CreateSuccessResponse(res, 200, "Xóa sản phẩm khỏi giỏ hàng thành công");
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
});

module.exports = router;