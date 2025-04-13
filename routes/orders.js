var express = require('express');
var router = express.Router();
let orderController = require('../controllers/order')
let { CreateErrorResponse, CreateSuccessResponse } = require('../utils/responseHandler');
const { check_authentication } = require('../utils/check_auth');

router.get('/', check_authentication, async function (req, res, next) {
    try {
        let userId = req.user._id;
        console.log(userId);
        let orders = await orderController.GetAllOrders(userId);
        CreateSuccessResponse(res, 200, orders);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
}   
);

router.post('/',check_authentication, async function (req, res, next) {
    try {
        let userId = req.user._id;
        console.log(userId);
        let body = req.body;
        console.log(body);
        let order = await orderController.CreateOrder(userId, body);
        CreateSuccessResponse(res, 200, order);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
}
);

module.exports = router;