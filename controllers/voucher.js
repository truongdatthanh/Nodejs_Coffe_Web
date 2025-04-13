let voucherSchema = require('../schemas/voucher')

module.exports = {
    CreateVoucher: async function (body) {
        try {
            let voucher = await voucherSchema.findOne({ code: body.code });
            if (voucher) {
                throw new Error("Mã giảm giá đã tồn tại")
            }
            voucher = new voucherSchema({
                code: body.code,
                discountType: body.discountType,
                discountValue: body.discountValue,
                maxUses: body.maxUses,
                expiryDate: body.expiryDate,
                isActive: body.isActive
            });
            return await voucher.save();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    GetAllVouchers: async function () {
        try {
            let vouchers = await voucherSchema.find({}).sort({ createdAt: -1 });
            return vouchers;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    GetVoucherById: async function (id) {
        try {
            let voucher = await voucherSchema.findById(id);
            if (!voucher) {
                throw new Error("Voucher not found");
            }
            return voucher;
        } catch (error) {
            throw new Error(error.message);
        }
    },
}