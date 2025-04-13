let voucherController = require('../controllers/voucher')
let express = require('express');
let router = express.Router();
let { CreateErrorResponse, CreateSuccessResponse } = require('../utils/responseHandler');
const { check_authentication, check_authorization } = require('../utils/check_auth');
const constants = require('../utils/constants');

router.get('/',check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
    try {
        let vouchers = await voucherController.GetAllVouchers();
        CreateSuccessResponse(res, 200, vouchers);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
});

router.post('/',check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
    try {
        let body = req.body;
        let voucher = await voucherController.CreateVoucher(body);
        CreateSuccessResponse(res, 200, voucher);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
}
);

router.get('/:code',check_authentication, async function (req, res, next) {
    try {
        let code = req.params.code;
        let voucher = await voucherController.GetVoucherByCode(code);
        CreateSuccessResponse(res, 200, voucher);
    } catch (error) {
        CreateErrorResponse(res, 404, error.message);
    }
}
);

module.exports = router;