const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT||5000;

app.get('/',(req, res)=>{
    res.send('Nature Nurture server is running...');
})

app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
})

// DB URI 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vkjl2uu.mongodb.net/?retryWrites=true&w=majority`;
// MongoDB connection 
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});
async function run() {
    try {
      
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
  }
run().catch(console.dir);
