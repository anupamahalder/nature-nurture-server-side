const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


const app = express();
const port = process.env.PORT||5000;

// middleware 
// parsers  to pasrsers data 
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'],
}))

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


    // create post api to get access token from client 
    app.post('/api/v1/auth/access-token', async(req, res)=>{
      // creating token and sending to client
      // here we are expecting that client will send object inside body 
      const user = req.body;
      // jwt.sign takes payload as object then secret and it will give token in return
      const token = jwt.sign(user, process.env.AUTH_ACCESS_TOKEN);
      console.log(token);
      // in cookie first paramter indicates in which name we want to save this and 2nd parameter is option 
      res.cookie('token',{
        httpO
      })
    })
    // get services data 
    app.get('/api/v1/services', async(req, res)=>{
      const cursor = servicesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    // get specific service data 
    app.get('/api/v1/service-detail/:id', async(req, res)=>{
      const id = req.params;
      const query = {_id: new ObjectId(id)};
      const cursor = await servicesCollection.findOne(query);
      res.send(cursor);
    })

    // get all bookings data 
    // app.get('/api/v1/bookings', async(req, res)=>{
    //   const cursor = bookingsCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // })

    // get bookings data for a specific user email 
    app.get('/api/v1/bookings-data', async(req, res)=>{
      // from client side email will get as query parameter 
      console.log(req.query.email);
      let query={};
      if(req.query?.email){
        query = {email: req.query.email};
        const result = await bookingsCollection.find(query).toArray();
        res.send(result);
      }
      else{
        res.status(404).send({message: "anauthorized access"});
      }
    })
    // create route for post bookings data 
    app.post('/api/v1/user/create-booking', async(req, res)=>{
      // console.log(req.body);
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