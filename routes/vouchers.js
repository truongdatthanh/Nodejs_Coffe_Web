let voucherController = require('../controllers/voucher')
let express = require('express');
let router = express.Router();
let { CreateErrorResponse, CreateSuccessResponse } = require('../utils/responseHandler');

router.get('/', async function (req, res, next) {
    try {
        let vouchers = await voucherController.GetAllVouchers();
        CreateSuccessResponse(res, 200, vouchers);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
});

router.post('/', async function (req, res, next) {
    try {
        let body = req.body;
        let voucher = await voucherController.CreateVoucher(body);
        CreateSuccessResponse(res, 200, voucher);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
}
);

module.exports = router;