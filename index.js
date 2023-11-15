const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const userCollection = client.db('NatureDatabase').collection('usersDB');

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
    // get user data with given email
    app.get('/api/v1/user/:userEmail', async(req, res)=>{
      const email = req.params.userEmail;
      const query = {email: email};
      const result = await userCollection.find(query);
      res.send(result);
    })
    // create user data 
    app.post('/api/v1/create-user', async(req, res)=>{
      // console.log(req.body);
      const userData = req.body;
      const result = await userCollection.insertOne(userData);
      res.send(result);
    })
    // cancel booking with id(id will come from client side)
    // each id will be different so we need to recieve id dynamically using /:id 
    app.delete('/api/v1/user/cancel-booking/:bookingId', async(req, res)=>{
      // id will come from body of request 
      const id = req.params.bookingId;
      // console.log(id);
      const query = {_id: new ObjectId(id)};
      const result = await bookingsCollection.deleteOne(query);
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