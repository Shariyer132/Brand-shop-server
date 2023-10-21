const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/user', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fbkj2kv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect(); //need to comment in

    const productCollection = client.db("productsDB").collection("products");
    const cartProducts = client.db("cartProductDB").collection("cartProduct");

    app.get('/products', async(req, res)=>{
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result) 
    })

    app.post('/products', async(req, res)=>{
        const product = req.body;
        console.log(product); 
        const result = await productCollection.insertOne(product);
        res.send(result);
    })

    app.get('/cartProducts', async(req, res)=>{
      const cursor = cartProducts.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.post('/cartProducts', async(req, res)=>{
      const prodect = req.body;
      const result = await cartProducts.insertOne(prodect)
      res.send(result)
    })

    app.delete('/cartProducts/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await cartProducts.deleteOne(query);
      console.log(result, id, query);
      res.send(result)
    })

    app.get('/products/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productCollection.findOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });//need to comment in
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`port is running on ${port}`)
})