let mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Danh mục không được để trống"],
        unique:[true,"Danh mục này đã tồn tại"],
    },description:{
        type:String,
        default:""
    },isDeleted:{
        type:Boolean,
        default:false
    },
    slug:String
},{
    timestamps:true
})
module.exports = mongoose.model('category',categorySchema)
