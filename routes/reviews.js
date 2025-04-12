var express = require('express');
var router = express.Router();
let reviewController = require('../controllers/reviews');
let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');
let { check_authentication, check_authorization } = require('../utils/check_auth');
const constants = require('../utils/constants');

/**
 * Lấy tất cả review (admin/mod)
 */
router.get('/', check_authentication, check_authorization(constants.MOD_PERMISSION), async function (req, res, next) {
  try {
    let reviews = await reviewController.GetAllReviews();
    CreateSuccessResponse(res, 200, reviews);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

/**
 * Lấy review theo productId (public)
 */
router.get('/product/:productId', async function (req, res, next) {
  try {
    let result = await reviewController.GetReviewsByProductID(req.params.productId);
    CreateSuccessResponse(res, 200, result);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

/**
 * Tạo review (yêu cầu đăng nhập)
 */
router.post('/', check_authentication, async function (req, res, next) {
  try {
    let { productId, rating, comment } = req.body;
    console.log(req.body);
    let newReview = await reviewController.CreateAReview(req.user._id, req.body);
    CreateSuccessResponse(res, 200, newReview);
  } catch (error) {
    CreateErrorResponse(res, 400, error.message);
  }
});

/**
 * Cập nhật review (chỉ người tạo review)
 */
router.put('/:id', check_authentication, async function (req, res, next) {
  try {
    let updated = await reviewController.UpdateAReview(req.params.id, req.user._id, req.body);
    CreateSuccessResponse(res, 200, updated);
  } catch (error) {
    CreateErrorResponse(res, 400, error.message);
  }
});

/**
 * Xóa (ẩn) review - chỉ người tạo hoặc admin
 */
router.delete('/:id', check_authentication, async function (req, res, next) {
  try {
    // Nếu là admin hoặc mod thì có quyền xóa bất kỳ review nào
    let isAdmin = req.user.role?.permission === constants.ADMIN_PERMISSION;
    let deleted = await reviewController.DeleteAReview(req.params.id, req.user._id, isAdmin);
    CreateSuccessResponse(res, 200, deleted);
  } catch (error) {
    CreateErrorResponse(res, 400, error.message);
  }
});

module.exports = router;
