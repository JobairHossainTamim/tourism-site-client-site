const express = require("express");
require('dotenv').config();
const cors=require('cors');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const app=express();
const port=process.env.PORT || 5000;


// Middle wire
app.use(cors());
app.use(express.json());



// Root Api
app.get('/',(req, res)=>{
    res.send("Server is Running ");
});
// mongodb connection  database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ylwaj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("connect to the server");
        const database=client.db('tour-planner');
        const serviceCollection = database.collection("service");
        const cartCollection = database.collection("cart");
        const bannerCollection = database.collection("banner");


        // Get All Api From Show in server
        app.get('/service' ,async (req, res)=>{
            const cursor= serviceCollection.find({});
            const service=await cursor.toArray();
            res.send(service);
        })
        // Get all banner
        app.get('/banner',async (req, res)=>{
            const cursor= bannerCollection.find({});
            const service=await cursor.toArray();
            res.send(service);
        })
        // Get Single Service
        app.get('/service/:id',async(req, res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const service=await serviceCollection.findOne(query);
            res.json(service);

        })
        //  For Add Service POST API
        app.post('/service',async (req,res)=>{
            const service=req.body;
            const result=await serviceCollection.insertOne(service);
            res.json(result);
        });

        // Cart Api For data
        app.post('/cart' , async (req, res)=>{
            const cart=req.body;
            const result=await cartCollection.insertOne(cart);
            res.json(result);
        })
        // Cart get all database
        app.get('/cart' ,async (req, res)=>{
            const cart= cartCollection.find({});
            const service=await cart.toArray();
            res.send(service);
        })
        // Load cart data according to email
        app.get('/cart/:email',async (req, res)=>{
            const email=req.params.email;
            const query={email :email};
            const cart=await cartCollection.find(query).toArray();
            res.json(cart);
        }) 
        // // DELETE Cart Order
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.json(result);
        });

        // Update Api
        app.put('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedUser.status
                },
            };

            const result = await cartCollection.updateOne(filter, updateDoc, options)
            
            res.json(result)
        })

        } 
 
     finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port,()=>{
      
    });

