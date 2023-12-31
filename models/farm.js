const mongoose = require('mongoose');
const { Schema } = mongoose;

const Product = require('./Product')

const farmSchema = new Schema({
    name:{
        type: String,
        required: [true, `農場名が必要です`]
    },
    city: {
        type: String,
    },
    email: {
        type: String,
        required: [true, `emailが必要です`]
    },
    category: {
        type: String,
        enum: [`果物`, `野菜`, `乳製品`]
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: `Product`
        }
    ]
});


farmSchema.post(`findOneAndDelete`, async function (farm) {
    if (farm.products.length) {
       const res = await Product.deleteMany({_id:{$in:farm.products}});
       console.log(res);
    }
})

const Farm = mongoose.model(`Farm`, farmSchema);
module.exports = Farm;
