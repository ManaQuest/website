const mysql = require("mysql2");
const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");
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
      else {
        if (!req.query.res)
          res.render(__dirname + '/index.hbs', { Results: results, display: 'none' });
        else
          res.render(__dirname + '/index.hbs', { Results: results, display: 'block', Id: req.query.res });
      }
    });
});
app.get("/:nameId/buy", function (req, res) {
  connection.query("select Name,Count from product where Name='" + req.params['nameId'] + "';",
    function (err, results) {
      if (err) console.log(err);
      else { res.render(__dirname + '/buy.hbs', { Results: results }); }
    });
});
app.get("/*.js", function (req, res) {
  res.sendFile(__dirname + req.url);
});
app.post("/purchased", function (req, res) {
  connection.query("insert ignore into buyers(First_name,Last_Name,House,Email,Name_Product,Count_in_Order) values ('" + req.body.first_name + "','" + req.body.last_name + "','" + req.body.house + "','" + req.body.email + "','" + req.body.name + "'," + req.body.count + ");", function (err, results) {
    if (results['affectedRows'] == 1) {
      connection.query("UPDATE product set Count = Count -" + req.body.count + " where Count-" + req.body.count + ">0 and Name='" + req.body.name + "';", function (request, response) {
        if (response['changedRows'] == 1) {
          connection.query("select * from buyers where First_name='" + req.body.first_name + "' and Last_Name='" + req.body.last_name + "'", function (er, result) { res.render(__dirname + '/letter.hbs', { Id: "Ваш номер заказа " + result[0]['Id'] + ". Вам выслано электронное письмо на почту.", display: 'block' }); });
        }
        else {
          connection.query("delete from buyers where First_name='" + req.body.first_name + "' and Last_Name='" + req.body.last_name + "'");
          res.render(__dirname + '/index.hbs', { Results: results, Id: "Нужного количества товара не осталось.", display: 'block' });
        }
      });
    }
    else {
      res.redirect("/?res=Человек с таким именем, фамилией, email или домом уже существует. Измените заказ или обратитесь ко мне.");
    }
  });
});
app.post("/id", function (req, res) {
  var file = fs.readFileSync("info.json", "utf8");
  file = JSON.parse(file);
  file.push({ "id": file.length });
  fs.writeFileSync("info.json", JSON.stringify(file));
  res.send({ "id": file.length - 1 });
});
app.post("/basket", function (req, res) {
  var file = fs.readFileSync("info.json", "utf8");
  file = JSON.parse(file);
  for (i of file)
    if (i.id == req.body.id) {
      if (i.basket === undefined) {
        i.basket = [];
        i.count = [];
      }
      if (!i.basket.includes(req.body.name)) {
        i.basket.push(req.body.name);
        i.count.push(req.body.count);
      }
      else
        i.count[i.basket.indexOf(req.body.name)] = i.count[i.basket.indexOf(req.body.name)] + req.body.count;
    }
  console.log(file);
  fs.writeFileSync("info.json", JSON.stringify(file));
  res.send({ "id": file.length - 1 });
});
app.get("*", function (request, response) {
  response.send(request.url)
});
app.listen(3000, () => {
  console.log('Application listening on port 3000!');
});