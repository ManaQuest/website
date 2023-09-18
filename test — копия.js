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
  if (req.body.id == -1) {
    file.push({ "id": file.length });
    fs.writeFileSync("info.json", JSON.stringify(file));
    res.send({ "id": file.length - 1 });
  }
  else {
    let count = 0;
    for (i of file) {
      if (i.id != req.body.id)
        count++;
    }
    if (count == file.length) {
      file.push({ "id": parseInt(req.body.id) });
      fs.writeFileSync("info.json", JSON.stringify(file));
      res.send({ "id": req.body.id });
    }
  }
});
app.post("/basket", function (req, res) {
  connection.query("select * from product where Name='" + req.body.name + "';", function (err, result) {
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
          if (!file[0].name.includes(req.body.name)) {
            file[0].name.push(req.body.name);
            file[0].count.push(req.body.count);
          }
          else if(file[0].count[file[0].name.indexOf(req.body.name)] + req.body.count<=result[0]["Count"])
            file[0].count[file[0].name.indexOf(req.body.name)] += req.body.count;
        }
        else if (i.count[i.basket.indexOf(req.body.name)] + req.body.count <= result[0]["Count"]) {
          i.count[i.basket.indexOf(req.body.name)] += req.body.count;
          file[0].count[file[0].name.indexOf(req.body.name)] += req.body.count;
          console.log(file[0].name.indexOf(req.body.name));
        }
      }
    if (result[0]["Count"] < file[0].count[file[0].name.indexOf(req.body.name)])
      for (let i = file.length - 1; i >= 0; i--)
        if (file[i].basket)
          if (file[i].basket.includes(req.body.name) && file[0].count[file[0].name.indexOf(req.body.name)] - result[0]["Count"] >= file[i].count[file[i].basket.indexOf(req.body.name)]) {
            file[0].count[file[0].name.indexOf(req.body.name)] -= file[i].count[file[i].basket.indexOf(req.body.name)];
            file[i].count[file[i].basket.indexOf(req.body.name)] = 0;
            file[i].basket.splice(file[i].basket.indexOf(req.body.name), 1);
            file[i].count.splice(file[i].basket.indexOf(req.body.name), 1);
          }
          else if (file[i].basket.includes(req.body.name) && file[0].count[file[0].name.indexOf(req.body.name)] - result[0]["Count"] < file[i].count[file[i].basket.indexOf(req.body.name)]) {
            file[i].count[file[i].basket.indexOf(req.body.name)] -= file[0].count[file[0].name.indexOf(req.body.name)] - result[0]["Count"];
            file[0].count[file[0].name.indexOf(req.body.name)] -= file[0].count[file[0].name.indexOf(req.body.name)] - result[0]["Count"];
            if (file[i].count[file[i].basket.indexOf(req.body.name)] > file[0].count[file[0].name.indexOf(req.body.name)])
              file[i].count[file[i].basket.indexOf(req.body.name)] = file[0].count[file[0].name.indexOf(req.body.name)]
          }
    console.log(file);
    fs.writeFileSync("info.json", JSON.stringify(file));
  });
});
app.get("*", function (request, response) {
  response.send(request.url)
});
app.listen(3000, () => {
  console.log('Application listening on port 3000!');
});