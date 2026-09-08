const express = require("express");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
// app.use(express.static(path.join(__dirname, 'public')));
const PORT = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const MONGO_URL = "mongodb://admin:abc@mongodb:27017";
const client = new MongoClient(MONGO_URL);

//GET all users
app.get("/getUsers", async (req, res) => {
    await client.connect(MONGO_URL);
    console.log('Connected successfully to server');

    const db = client.db("demo-db");
    const data = await db.collection('users').find({}).toArray();

    
    client.close();
    res.send(data);
});

//POST new user
app.post("/addUser", async (req, res) => {
    const userObj = req.body;
    console.log(req.body);
    await client.connect(MONGO_URL);
    console.log('Connected successfully to server');

    const db = client.db("demo-db");
    const data = await db.collection('users').insertOne(userObj);
    console.log(data);
    console.log("data inserted in DB");


    res.send(`<h1>Account Created Successfully!</h1><p>Welcome, ${userObj.username}!</p><a href="/">Go Back</a>`);
    client.close();
});


app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});