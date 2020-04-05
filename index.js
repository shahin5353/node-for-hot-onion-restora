const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = process.env.DB_PATH;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

app.use(cors())
app.use(bodyParser.json())
app.get('/items', (req, res) => {
    client.connect(err => {
        const collection = client.db("hot-onion-restora").collection("items");
        collection.find().toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(documents);
            }
        })
    });
});
app.get('/item/:key', (req, res) => {
    const key = req.params.key;
    client.connect(err => {
        const collection = client.db("hot-onion-restora").collection("items");
        collection.find({ key }).toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(documents[0]);
            }
        })
    });
});

app.post('/getItemByKey', (req, res) => {
    const itemKeys = req.body;
    client.connect(err => {
        const collection = client.db("hot-onion-restora").collection("items");
        collection.find({ key: { $in: itemKeys } }).toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(documents);
            }
        })
    });
});

app.post('/addItem', (req, res) => {
    const items = req.body
    client.connect(err => {
        const collection = client.db("hot-onion-restora").collection("items");
        collection.insert(items, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result.ops);
            }
        })
    })
})
app.get('/features', (req, res) => {
    client.connect(err => {
        const collection = client.db("hot-onion-restora").collection("features");
        collection.find().toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(documents);
            }
        })
    });
});
app.post('/placeOrder', (req, res) => {
    const orderDetails = req.body
    orderDetails.orderTime = new Date()
    client.connect(err => {
        const collection = client.db("hot-onion-restora").collection("orders");
        collection.insertOne(orderDetails, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result.ops[0]);
            }
        })
    });
})





app.listen(process.env.PORT, () => console.log("Listening from port", process.env.PORT))

