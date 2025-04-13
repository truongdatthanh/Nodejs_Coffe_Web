let reviewSchema = require('../schemas/review') 
let productSchema = require('../schemas/product')
let userSchema = require('../schemas/user')

module.exports = {
 
  GetAllReviews: async function () {
    return await reviewSchema.find({ isVisible: true })
      .populate('user', 'username')
      .populate('product', 'name')
  },

  // Lấy review theo product
  GetReviewsByProductID: async function (productId) {
    return await reviewSchema.find({
      product: productId,
      isVisible: true
    }).populate('user', 'username');
  },

  // Tạo mới một review
  CreateAReview: async function (userId,body) {
    try {
        let product= await productSchema.findOne({name:body.product});
      // Kiểm tra trùng
      let existing = await reviewSchema.findOne({
        user: userId,
        product: product._id,
      });

      if (existing) {
        throw new Error('Bạn đã đánh giá sản phẩm này rồi');
      }

      let newReview = new reviewSchema({
        user: userId,
        product: product._id,
        rating: body.rating,
        comment: body.comment,
        isVisible: true
      });

      return await newReview.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Cập nhật review
  UpdateAReview: async function (reviewId, userId, body) {
    let review = await reviewSchema.findById(reviewId);

    if (!review) {
      throw new Error('Review không tồn tại');
    }

    if (review.user.toString() !== userId.toString()) {
      throw new Error('Không có quyền chỉnh sửa đánh giá này');
    }

    let allowField = ['rating', 'comment'];
    for (const key of Object.keys(body)) {
      if (allowField.includes(key)) {
        review[key] = body[key];
      }
    }

    return await review.save();
  },

  // Xoá (ẩn) review
  DeleteAReview: async function (reviewId, userId, isAdmin = false) {
    let review = await reviewSchema.findById(reviewId);

    if (!review) {
      throw new Error('Review không tồn tại');
    }

    if (!isAdmin && review.user.toString() !== userId.toString()) {
      throw new Error('Không có quyền xóa đánh giá này');
    }

    review.isVisible = false;
    return await review.save();
  }
};
