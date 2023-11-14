const express = require('express');
const app = express();
const path = require(`path`);
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Product = require('./models/Product');
const Farm = require('./models/farm')

mongoose.connect('mongodb://127.0.0.1:27017/farmStandTake2', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`MongoDBコネクションOK！`);
    })
    .catch(err => {
        console.log(`MongoDBコネクションエラー！`);
        console.log(err);
    });

    
app.set(`views`, path.join(__dirname,`views`));
app.set(`view engine`, `ejs`);
app.use(express.urlencoded({extended: true})); 
app.use(methodOverride('_method'));


//　Farm関連
app.get(`/farms`, async (req, res) => {
    const farms = await Farm.find({});
    res.render(`farms/index`, { farms });
});

app.get(`/farms/new`, (req, res) => {
    res.render(`farms/new`);
});

app.post(`/farms`, async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    res.redirect(`/farms/${farm._id}`);
});

app.get('/farms/:id', async (req, res) => {	
    const farm = await Farm.findById(req.params.id).populate(`products`);
    res.render(`farms/show`, { farm })
});

app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render(`products/new`, { categories, farm });
});

app.post('/farms/:id/products', async(req, res) => {
    const { id }  = req.params;
    const farm = await Farm.findById(id);
    const {name, price, category} =  req.body;
    const product = new Product({name, price, category});
    farm.products.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();
    res.redirect(`/farms/${farm._id}`);
});

app.delete('/farms/:id', async(req, res) => {
   await Farm.findByIdAndDelete(req.params.id);
   res.redirect(`/farms`);
});

// Product関連
const categories = [`果物`, `野菜`, `乳製品`, `菓子`];


app.get('/products/new', (req, res) => {
    res.render(`products/new`, { categories });
});

app.post('/products', (req, res) => {
    const newProduct = new Product(req.body);
    newProduct.save();
    console.log(newProduct);
    res.redirect(`/products/${newProduct._id}`);
});

app.get('/products', async(req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category }); 
                                            //   category:category だがキーと値が同じなので省略できる
        res.render(`products/index`, { products, category });   
    } else {
        const products = await Product.find({});
        res.render(`products/index`, { products, category:`全` });  
    }
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate(`farm`, `name`);
    // Product.findOne({_id: id})としてもいいが、findByIdの方がシンプルに使える
    res.render(`products/show`, { product });
});

app.get(`/products/:id/edit`, async(req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render(`products/edit`,{ product, categories });
});

app.put('/products/:id', async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true});
    res.redirect(`/products/${product._id}`);
});

app.delete('/products/:id', async(req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect(`/products`);
});


app.listen(3000, () => {
    console.log(`ポート3000でリクエストを待受中...`);
});

