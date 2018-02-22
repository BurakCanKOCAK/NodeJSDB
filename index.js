
//express
var express = require('express');
var app = express();
//db
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');

//Others
const bodyParsser=require('body-parser');

//-----------------------------------------------------------//
var check;
db.serialize(function() {
  db.run("CREATE TABLE if not exists user (ROWID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,flatId INT, info TEXT)");
  var ROWID=null;
  var stmt = db.prepare("INSERT INTO user VALUES ("+ROWID+",?,?)");
  for (var i = 0; i < 10; i++) {
      var d = new Date();
      var n = d.toLocaleTimeString();
      stmt.run(n,"User"+i);
  }
  stmt.finalize();

  db.each("SELECT flatId, info FROM user", function(err, row) {
      console.log(row.flatId + " : " + row.info);
  });
});

//--------------------------------------------------------//
app.get('/',function(req,res){
    res.send('HELLO!');
})

app.get('/home/:version',(req,res)=>{
    res.send('HOME! &s',req.params.version);
})

app.get('/db',function(req,res){
    //REACH DB AND GET DATA
    var textF="";
    db.serialize(function() {
        db.each("SELECT rowid,flatId, info FROM user", function(err, row) { 
            if (err) 
            {
                res.send('Error in DB transaction!');
                console.log(err)
            } 
            console.log("User id : "+row.rowid+" - "+row.flatId+" - "+row.info);  
         }); 
    });
     //DB CLOSE

    res.send(textF); 
})

app.get('/list',(req,res)=>{
    res.sendFile(__dirname+'/static/index.html')
})

//--------------------------------------------------------//
var server = app.listen(8081,"127.0.0.1", function (res,req) {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Server listening at http://%s:%s", host, port)
 })
 

 function closeDb() {
    db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Database connection closed!');
    });
}