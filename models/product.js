const mongoose = require('mongoose');
const { Schema } = mongoose;


const productSchema = new Schema({
    name: {
        type: String,
        required: true
        // デフォルトではreuiredはfalse、trueにすることで必須項目にできる
    },
    price: {
        type: Number,
        required: true,
        min:0
    },
    category: {
        type: String,
        enum: [`果物`, `野菜`, `乳製品`, `菓子`]
    },
    farm: {
        type: Schema.Types.ObjectId,
        ref: `Farm`
    }
});

const Product = mongoose.model(`Product`, productSchema);

module.exports = Product;

