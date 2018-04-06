var mongoose=require('mongoose');

var productSchema= mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name: {type:String, required:true},
    price: {type:Number, required:true}
});

var products=mongoose.model('products',productSchema);

module.exports={
    Products:products
}
// module.exports=mongoose.model('Product',productSchema);