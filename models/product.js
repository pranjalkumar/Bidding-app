var mongoose=require('mongoose');

var productSchema= mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name: {type:String, required:true},
    description: {type:String,required:true},
    base_price: {type:Number, required:true},
    owner: {type:String, required:true},
    upload_date: {type:Date,required:true},
    sold_date: {type:Date},
    sold_to: {type:String},
    final_price: {type:String}

});

var products=mongoose.model('products',productSchema);

module.exports={
    Products:products
}
// module.exports=mongoose.model('Product',productSchema);