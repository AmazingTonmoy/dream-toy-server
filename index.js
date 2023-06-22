const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

// mongodb start



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.enkfsbs.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    const toyCollection = client.db('toysDB').collection('toys')

    app.get('/toys',async(req,res)=>{
      const cursor = toyCollection.find().limit(20);
        const result = await cursor.toArray();
        res.send(result)

    })

    app.get('/toys/:id', async (req, res) => {
      
          const id = req.params.id;
          const query = {_id : new ObjectId(id)}
          const result = await toyCollection.findOne(query)
         res.send(result);
        
    
    })
    // read
    

      app.get('/toys/email/:email', async (req, res) => {
        const email = req.params.email;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;
        const query = { email: email };
        const result = await toyCollection.find(query).sort({ price: sortDirection }).limit(20).toArray();
      
        res.send(result);
      });
      
    
    
      app.get('/toys/subs/:subcategory', async (req, res) => {
        const subcategory = req.params.subcategory;
        const query = { subcategory: subcategory }
        const result = await toyCollection.find(query).limit(6).toArray();
        res.send(result);
      })

      // post

    app.post('/toys',async(req,res)=>{
        const newToys = req.body;
        console.log(newToys)
        const result = await toyCollection.insertOne(newToys);
        res.send(result)
    })
    // update
    app.put('/toys/:id', async (req, res) => {
      
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const options = { upsert: true };
      const updateToys = req.body
      const updateNow ={
        $set:{
          picture:updateToys.picture, 
          price:updateToys.price,
          quantity:updateToys.quantity,
          description:updateToys.description
        }
      }
     
      const result = await toyCollection.updateOne(query,updateNow,options);
      res.send(result);

})


    // delete
    app.delete('/toys/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await toyCollection.deleteOne(query)
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


// mongodb end


app.get('/',(req,res) =>{
    res.send('server is running')
})

app.listen(port,()=>{
    console.log(`toy server is rnning on ${port} port `)
})
