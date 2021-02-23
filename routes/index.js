var express = require('express');
var router = express.Router();
var mongoDb = require('mongodb')
var assert = require('assert');
const { error } = require('console');
const { throws } = require('assert');
const {ObjectId} = require("mongodb");




var url = 'mongodb://localhost:27017/test'
router.get('/', function (req, res, next) {
  res.render('index', { title: "Node" });
});

// router.get('/test/:id',function(req,res,next){
//     res.render('test',{output:req.params.id})
// });
// router.post('/test/submit',function(req,res,next){
//   var id=req.body.id;
//   res.redirect('/test/'+id)
// });
router.get('/getdata', function (request, response, next) {
  var resultArray = [];
    mongoDb.connect(url, function (err, db) {
      assert.equal(null, err)
      var cursor = db.collection('user-data').find();

      if (err) {
        console.log(err);
      }
      else {
        cursor.forEach(function (doc, err) {
          assert.equal(null, err);
          resultArray.push(doc)
        }, function () {
          db.close()
          response.render('index', { items: resultArray })
          console.log("BB", { items: resultArray })
        });
      }

    })

});
router.post('/insert', function (req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  }
  console.log("AA", item)
  mongoDb.connect(url, function (err, db) {
    assert.equal(null, err);
    if (err) {
      console.log(err);
    } else {
      db.collection('user-data').insertOne(item, function (err, result) {
        assert.equal(null, err)
        console.log('Item inserted')
        db.close();
        res.redirect('/')

      });
    }
  })
});
router.post('/update-data', function (req, res, next) {
  var id={_id:new ObjectId(req.body.id)}
  var item ={$set:{
   
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  }}
  console.log("AA",id )
  mongoDb.connect(url, function (err, db) {
    assert.equal(null, err);
    if (err) {
      console.log(err);
    } else {
      db.collection('user-data').updateOne( id, item, function (err, result) {
        assert.equal(null, err)
        console.log('Item Updated')
        db.close();
        res.redirect('/')
      });
    }
  })
});
router.post('/delete-data', function (req, res, next) {
  var id={_id:new ObjectId(req.body.id)}
 
  mongoDb.connect(url, function (err, db) {
    assert.equal(null, err);
    if (err) {
      console.log(err);
    } else {
      db.collection('user-data').deleteOne( id, function (err, result) {
        assert.equal(null, err)
        console.log('Item Deleted')
        db.close();
        res.redirect('/')
      });
    }
  })
});
module.exports = router;
