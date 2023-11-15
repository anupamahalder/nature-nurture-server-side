const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT||5000;

// middleware 
// parsers  to pasrsers data 
app.use(express.json());

app.get('/',(req, res)=>{
    res.send('Nature Nurture server is running...');
})
app.listen(port,()=>{
  console.log(`Server is running on port: ${port}`);
})
// DB URI 
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.sgpxxii.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    // create service connection
    const servicesCollection = client.db('NatureDatabase').collection('servicesDB');
    // create booking collection 
    const bookingsCollection = client.db('NatureDatabase').collection('bookingsDB');
    // create user collection 
    const useCollection = client.db('NatureDatabase').collection('usersDB');

    // get services data 
    app.get('/api/v1/services', async(req, res)=>{
      const cursor = servicesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // create route for post bookings data 
    app.post('/api/v1/user/create-booking', async(req, res)=>{
      console.log(req.body);
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    })
    // create user data 
    app.post('/api/v1/create-user', async(req, res)=>{
      // console.log(req.body);
      const userData = req.body;
      const result = await useCollection.insertOne(userData);
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);