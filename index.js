const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


//password
const password = 'zsY9x8JMdk8T7-V';

const uri = "mongodb+srv://moshiur9185:zsY9x8JMdk8T7-V@cluster0.vakyo.mongodb.net/organidb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//meddleWare
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

  client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");

    app.get("/products", (req, res) => {
      productCollection.find({})
      .toArray((err, docs) => {
        res.send(docs)
      })
    })

    //update data
    app.get('/product/:id', (req, res) => {
      productCollection.find({_id: ObjectId(req.params.id)})
      .toArray((err, docs) => {
        res.send(docs[0]);
      })
    })

    //add data
    app.post('/addProduct', (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then((result) =>{
      console.log('add success');
      res.redirect('/');
    })
  })

  //update product info
  app.patch('/update/:id', (req, res) => {
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result =>{
      res.send(result.modifiedCount > 0);
    })
  })

    //data delete
    app.delete('/delete/:id', (req, res) => {
      productCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result =>{
        res.send(result.deletedCount > 0);
      })
    })
  
});


app.listen(3000)