
//express
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//db
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');
var cors = require('cors');

app.use(cors());

//Others
const bodyParsser=require('body-parser');

//-----------------------------------------------------------//
var check;
db.serialize(function() {
  db.run("CREATE TABLE if not exists user (ROWID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,flatId INT, info TEXT)");
  db.each("SELECT flatId, info FROM user", function(err, row) {
      console.log(row.flatId + " : " + row.info);
  });
});

//------------------------------------------------------------------------------/
//------------------------------------------------------------------------------/
app.get('/index',function(req,res){
    res.send();
})
//------------------------------------------------------------------------------/
app.get('/',function(req,res){
    res.sendFile(__dirname+'/static/index.html')
})
//------------------------------------------------------------------------------/
app.get('/home/:version',(req,res)=>{
    res.send('HOME! &s',req.params.version);
})
//------------------------------------------------------------------------------/
app.get('/db/put',(req,res)=>{
    var ROWID=null;
  var stmt = db.prepare("INSERT INTO user VALUES ("+ROWID+",?,?)");
  for (var i = 0; i < 10; i++) {
      var d = new Date();
      var n = d.toLocaleTimeString();
      stmt.run(n,"User"+i);
  }
  stmt.finalize();
  res.sendStatus(200); 

})
//------------------------------------------------------------------------------/
app.get('/db',function(req,res){
    //REACH DB AND GET DATA
    var textF="";
    db.serialize(function() {
        db.each("SELECT rowid,flatId, info FROM user", function(err, row) { 
            if (err) 
            {
                //res.send('Error in DB transaction!');
                console.log(err)
            } 
            else
            {
                //res.status(200).send("User id : "+row.rowid+" - "+row.flatId+" - "+row.info);
                //console.log("User id : "+row.rowid+" - "+row.flatId+" - "+row.info);
            }
              
         }); 
    }); 
    res.status(200).send({one:"one",two:"two"});
})
//------------------------------------------------------------------------------/
app.get('/list',(req,res)=>{
    res.sendFile(__dirname+'/static/index.html')
})

//------------------------------------------------------------------------------/
//------------------------------------------------------------------------------/
/*var server = app.listen(8081,"127.0.0.1", function (res,req) {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Server listening at http://%s:%s", host, port)
 })
 */

 server.listen(8081);

 function closeDb() {
    db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Database connection closed!');
    });
}

//io Socket Connection Between Interface and NodeJS
io.on('connection',function(socket){

    console.log("connect success");
    
    //Send data each second
    setInterval(function(){
        socket.emit('data',"oneoneone");
        console.log("ONE SEND");
    },1000)

    //Receive data when button clicked
    socket.on("btn_click",function(data){
        console.log("NODE DATA");
        console.log(data);
    })




})