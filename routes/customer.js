var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/xien5";

router.get('/', function (req, res) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var query = {name: "Company Inc", address: "Highway 37"};
        db.collection("customers").find(query).toArray(function (err, result) {
            if (err) throw res.send(err);

            res.json(result);

            db.close();
        });
    });

});

module.exports = router;
