const mysql = require("mysql2");
const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");
const app = express();
app.set('view engine', 'ejs');
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
      var file = fs.readFileSync("info.json", "utf8");
      file = JSON.parse(file);
      for (i of file) {
        for (j of results)
          if (i.basket.includes(j.Name) && i.count[i.basket.indexOf(j.Name)] > j.Count)
            i.count[i.basket.indexOf(j.Name)] = j.Count;
      }
      fs.writeFileSync("info.json", JSON.stringify(file));
      if (err) console.log(err);
      else {
        if (!req.query.res)
          res.render(__dirname + '/index.ejs', { Results: results, display: 'none', Id: "" });
        else
          res.render(__dirname + '/index.ejs', { Results: results, display: 'block', Id: req.query.res });
      }
    });
});
app.get("/basket/buy", function (req, res) {
  var file = fs.readFileSync("info.json", "utf8");
  file = JSON.parse(file);
  for (i of file)
    if (i.id == req.query.id)
      res.render(__dirname + '/buy.ejs', { Results: i, multi: true });
});
app.get("/:nameId/buy", function (req, res) {
  connection.query("select Name,Count from product where Name='" + req.params['nameId'] + "';",
    function (err, results) {
      if (err) console.log(err);
      else
        res.render(__dirname + '/buy.ejs', { Results: results, multi: false });
    });
});
app.get("/*.js", function (req, res) {
  res.sendFile(__dirname + req.url);
});
app.post("/purchased", function (req, res) {
  connection.query("UPDATE product set Count = Count -" + req.body.count + " where Count-" + req.body.count + ">=0 and Name='" + req.body.name + "';", function (request, response) {
    if (response['changedRows'] == 1)
      connection.query("select count(order_id) from buyers;", function (err, result) {
        connection.query("insert ignore into buyers(First_name,Last_Name,House,Email,Name_Product,Count_in_Order,Order_id) values ('" + req.body.first_name + "','" + req.body.last_name + "','" + req.body.house + "','" + req.body.email + "','" + req.body.name + "'," + req.body.count + "," + result[0]['count(order_id)'] + ");", function (err, results) {
          //res.render(__dirname + '/letter.hbs', { Id: "Ваш номер заказа " + result[0]['count(order_id)'] + ". Вам выслано электронное письмо на почту.", display: 'block' });
          res.redirect("/?res=Ваш номер заказа " + result[0]['count(order_id)'] + ". Вам выслано электронное письмо на почту.");
        });
      });
    else
      res.redirect("/?res=Нужного количества товара не осталось.");
  });
});
app.post("/purchased_all", function (req, res) {
  let sql = "insert ignore into buyers(First_name,Last_Name,House,Email,Name_Product,Count_in_Order) values ";
  for (i = 0; i < req.body.name.length; i++) {
    sql += "('" + req.body.first_name + "','" + req.body.last_name + "','" + req.body.house + "','" + req.body.email + "','" + req.body.name[i] + "'," + req.body.count[i] + ")";
    if (i < req.body.name.length - 1)
      sql += ",";
  }
  sql += ";";
});
async function update_all(name, count, i, max) {
  if (i == max)
    return 1;
  console.log("sdfdf");
connection.query("UPDATE product set Count = Count -" + count[i] + " where Count-" + count[i] + ">=0 and Name='" + name[i] + "';", function (err, result) {
    if (result['changedRows'] == 1)
      if (update_all(name, count, i + 1, max) == 1)
        return 1;
      else
        return 0;
    else
      return 0;
  });
}
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
      res.send({ "id": parseInt(req.body.id) });
    }
    else
      res.send({ "id": parseInt(req.body.id) });
  }
});
app.post("/basket", function (req, res) {
  connection.query("select * from product where Name='" + req.body.name + "';", function (err, result) {
    var file = fs.readFileSync("info.json", "utf8");
    file = JSON.parse(file);
    for (i of file) {
      if (i.id == req.body.id) {
        if (i.basket === undefined) {
          i.basket = [];
          i.count = [];
        }
        if (!i.basket.includes(req.body.name)) {
          if (result[0]["Count"] > 0) {
            i.basket.push(req.body.name);
            i.count.push(req.body.count);
          }
        }
        else
          if (i.count[i.basket.indexOf(req.body.name)] + req.body.count <= result[0]["Count"])
            i.count[i.basket.indexOf(req.body.name)] += req.body.count;
          else
            i.count[i.basket.indexOf(req.body.name)] = result[0]["Count"];
        res.send(i);
      }
      if (i.basket)
        if (result[0]["Count"] < i.count[i.basket.indexOf(req.body.name)])
          i.count[i.basket.indexOf(req.body.name)] = result[0]["Count"];
    }
    console.log(file);
    fs.writeFileSync("info.json", JSON.stringify(file));
  });
});
app.post("/basket_user", function (req, res) {
  var file = fs.readFileSync("info.json", "utf8");
  file = JSON.parse(file);
  for (i of file)
    if (i.id == req.body.id)
      res.send(i);
});
app.post("/update_basket", function (req, res) {
  connection.query("select * from product where Name='" + req.body.name + "';", function (err, result) {
    var file = fs.readFileSync("info.json", "utf8");
    file = JSON.parse(file);
    if (req.body.count < 0)
      req.body.count *= -1;
    for (i of file) {
      if (i.id == req.body.id && i.basket)
        if (req.body.method == 'add')
          if (req.body.count + i.count[i.basket.indexOf(req.body.name)] <= result[0]["Count"]) {
            i.count[i.basket.indexOf(req.body.name)] += req.body.count;
            res.send(i);
          }
          else {
            i.count[i.basket.indexOf(req.body.name)] = result[0]["Count"];
            res.send(i);
          }
        else
          if (i.count[i.basket.indexOf(req.body.name)] - req.body.count > 0) {
            i.count[i.basket.indexOf(req.body.name)] -= req.body.count;
            res.send(i);
          }
          else {
            i.count[i.basket.indexOf(req.body.name)] = 0;
            i.count.splice(i.basket.indexOf(req.body.name), 1);
            i.basket.splice(i.basket.indexOf(req.body.name), 1);
            res.send(i);
          }
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