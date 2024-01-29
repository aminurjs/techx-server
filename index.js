const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.port || 5000;

//MiddleWare
app.use(cors());
app.use(express.json());

const uri = process.env.mongoDBUri;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//Collections
const postsCollection = client.db("techx").collection("posts");
const commentsCollection = client.db("techx").collection("comments");

//Get all posts
app.get("/posts", async (req, res) => {
  const result = await postsCollection.find().toArray();
  res.send(result);
});

//Get single post
app.get("/post/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const query = { id };
  const result = await postsCollection.findOne(query);
  res.send(result);
});

//ADD post
app.post("/add-post", async (req, res) => {
  const data = req.body;
  const count = await postsCollection.estimatedDocumentCount();
  let id = 1;
  if (count) {
    id = count + 1;
  }
  const post = { ...data, id };
  const result = await postsCollection.insertOne(post);
  res.send(result);
});

//Update post
app.patch("/update-post/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const data = req.body;
  const query = { id };
  const updatedData = {
    $set: {
      ...data,
    },
  };
  const result = await postsCollection.updateOne(query, updatedData);
  res.send(result);
});

//Delete post
app.delete("/post/delete/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const query = { id };
  const result = await postsCollection.deleteOne(query);
  res.send(result);
});

//Get comments
app.get("/post/comments/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const query = { blogId: id };
  const result = await commentsCollection.find(query).toArray();
  res.send(result);
});

//Get single comment
app.get("/comment/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const query = { id };
  const result = await commentsCollection.findOne(query);
  res.send(result);
});

//Add comment
app.post("/comments", async (req, res) => {
  const data = req.body;
  const result = await commentsCollection.insertOne(data);
  res.send(result);
});

//Update comment
app.patch("/update-comment/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const data = req.body;
  const query = { id };
  const updatedData = {
    $set: {
      ...data,
    },
  };
  const result = await commentsCollection.updateOne(query, updatedData);
  res.send(result);
});

//Delete comment
app.delete("/comment/delete/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  const query = { id };
  const result = await commentsCollection.deleteOne(query);
  res.send(result);
  console.log(result);
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("TechX Server is running");
});

app.listen(port, () => {
  console.log(`Server running in the port: ${port}`);
});
