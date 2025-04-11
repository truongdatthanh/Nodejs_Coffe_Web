let mongoose = require('mongoose');

let productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Tên sản phẩm không được để trống"],
        unique:[true,"Tên sản phẩm đã tồn tại"],
    },quantity:{
        type:Number,
        min: 0,
        required:[true,"Số lượng không được để trống"],
    },price:{
        type:Number,
        min:0,
        required:[true,"Giá không được để trống"],
    },description:{
        type:String,
        default:""
    },imgURL:{
        type:String,
        default:""
    },category:{
        type:mongoose.Types.ObjectId,
        ref:'category',
        required:true
    }
    ,isDeleted:{
        type:Boolean,
        default:false
    },
    slug:String
},{
    timestamps:true
})
module.exports = mongoose.model('product',productSchema)
// Tao 1 schema cho obj category gồm name,description, timestamp