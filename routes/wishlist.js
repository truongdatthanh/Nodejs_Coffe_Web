const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist');
const { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');
const { check_authentication, check_authorization } = require('../utils/check_auth');
const { check } = require('express-validator');


router.get('/', check_authentication, async (req, res, next) => {
    try {
        let userId = req.user._id;
        const wishlist = await wishlistController.GetWishlistByUser(userId);
        CreateSuccessResponse(res, 200, wishlist);
    } catch (error) {
        CreateErrorResponse(res, 500, error.message);
    }
});


// Thêm sản phẩm vào wishlist
router.post('/', check_authentication, async (req, res, next) => {
    try {
        let userId = req.user._id;
        let body = req.body;
        const result = await wishlistController.AddToWishlist(userId, body);
        CreateSuccessResponse(res, 200, result);
    } catch (error) {
        CreateErrorResponse(res, 500, error.message);
    }
});

// Xoá sản phẩm khỏi wishlist
router.delete('/',check_authentication, async (req, res, next) => {
    try {
        let userId = req.user._id;
        console.log(userId);
        let body = req.body;
        console.log(body);
        const result = await wishlistController.RemoveFromWishlist(userId, body);
        CreateSuccessResponse(res, 200, result);
    } catch (error) {
        CreateErrorResponse(res, 500, error.message);
    }
});

module.exports = router;
