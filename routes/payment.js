let paymentController = require('../controllers/payment')
let express = require('express');
let router = express.Router();
let { CreateErrorResponse, CreateSuccessResponse } = require('../utils/responseHandler');
const {  check_authentication } = require('../utils/check_auth');

router.post('/',check_authentication, async function (req, res, next) {
    try {
        let userId = req.user._id;
        let body = req.body;
        console.log(body);
        let payment = await paymentController.CreatePayment(userId, body);
        CreateSuccessResponse(res, 200, payment);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
}
);

module.exports = router;