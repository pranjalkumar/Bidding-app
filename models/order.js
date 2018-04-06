var mongoose=require('mongoose');

var productSchema= mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    product: {type:mongoose.Schema.Types.ObjectId, ref: 'products'},
    quantity: {type:Number,default:1}
});

var orders=mongoose.model('orders',productSchema);

module.exports={
    Orders:orders
}
// module.exports=mongoose.model('Product',productSchema);