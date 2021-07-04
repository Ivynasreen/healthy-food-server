const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()
// const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9d6zf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const express = require('express')
const app = express()

app.use(cors());
app.use(bodyParser.json());

const port = process.env.port | 5500 ;

app.get('/',  (req, res) => {
    res.send("Hello World!")
})


app.listen(process.env.PORT || port ,  () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const blogCollection = client.db("healthyFood").collection("blog");
    const adminCollection = client.db("healthyFood").collection("admin");
    console.log('database connected')

    app.post('/addBlog' , (req,res)=> {
        const newBlog = req.body;
        console.log('adding new blog:' , newBlog)
        blogCollection.insertOne(newBlog)
        .then(result => {
            // console.log('inserted count' , result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    });
    app.get('/blog', (req, res) => {
        blogCollection.find()
        .toArray((err, blog) => {
        //   console.log('from database' , blog)
          res.send(blog)
        })
    });
    app.post('/makeAdmin', (req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        adminCollection.insertOne({ name, email })
            .then(result => {
              console.log('inserted count' , result.insertedCount)
                res.send(result.insertedCount > 0);
            })
      })
      
      app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            })
    })
  
});