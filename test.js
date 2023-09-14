const mysql = require("mysql2");
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'hbs');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const connection = mysql.createConnection({
  host: "localhost",
  port: "3030",
  user: "root",
  password: "12345",
  database: "shop"
});

app.get('/', function (req, res) {
  connection.query("select * from product;",
    function (err, results) {
      if (err) console.log(err);
      else {console.log(req.params);res.render(__dirname + '/index.hbs', {Results: results,Id:req.params.id}); }
    });
});
app.get("/:nameId/buy", function (req, res) {
  connection.query("select Name,Count from product where Name='" + req.params['nameId'] + "';",
    function (err, results) {
      if (err) console.log(err);
      else { res.render(__dirname + '/buy.hbs', { Results: results}); }
    });
});
app.get("/*.js", function (req, res) {
  res.sendFile(__dirname + req.url);
});
app.post("*", function (req, res) {
  connection.query("UPDATE product set Count = Count -" + req.body.count + " where Count-" + req.body.count + ">0 and Name='" + req.body.name + "';", function (request, response) {
    if (response['changedRows'] == 1) {console.log(response);
      connection.query("insert buyers(First_name,Last_Name,House,Email,Name_Product,Count) values ('" + req.body.first_name + "','" + req.body.last_name + "','" + req.body.house + "','" + req.body.email + "','" + req.body.name + "'," + req.body.count + ");");
      connection.query("select * from buyers where First_name='"+req.body.first_name+"' and Last_Name='"+req.body.last_name+"'",function (err, results){});
    }
    else{
      res.redirect("/Pen");
    }
  });
});
app.get("*", function (request, response) {
  response.send(request.url)
});
app.listen(3000, () => {
  console.log('Application listening on port 3000!');
});