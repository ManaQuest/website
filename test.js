const mysql = require("mysql2");
const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");
cookieParser = require('cookie-parser');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser('secret key'));
var select_product = "select * from product";



const connection = mysql.createConnection({
  host: "localhost",
  port: "3030",
  user: "root",
  password: "12345",
  database: "shop"
});

app.get('/', function (req, res) {
  console.log(req.cookies);
  if (!req.query.res)
    res.render(__dirname + '/сайт/index.ejs',{q:req.cookies});
  else if (req.query.res >= 0)
    res.render(__dirname + '/сайт/index.ejs', { Id: "Ваш номер заказа " + req.query.res + ". Вам выслано электронное письмо на почту." });
  else if (req.query.res == -1)
    res.render(__dirname + '/сайт/index.ejs', { Id: "Нужного количества товара не осталось." });
});
app.get('/shop', function (req, res) {
  connection.query(select_product + ";",
    function (err, results) {
      if (err) console.log(err);
      else
        res.render(__dirname + '/сайт/item.ejs', { Results: results });
    });
});
app.get('/basket', function (req, res) {
  connection.query(select_product, function (err, results) {
    for (i of Object.keys(req.cookies))
      if (req.cookies[i] == 0)
        req.clearCookie(i);
    res.render(__dirname + '/сайт/basket.ejs', { user_info: req.cookies, Results: results });
  });
});
app.get("/basket/buy", function (req, res) {
  connection.query(select_product + ";",
    function (err, results) {
      res.render(__dirname + '/buy.ejs', { Results: {} });
    });
});
app.get("/:nameId/buy", function (req, res) {
  connection.query(select_product + " where Name='" + req.params['nameId'] + "';",
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
      connection.query("select max(Order_id) from buyers;", function (err, result) {
        if (result[0]['max(Order_id)'] == null)
          connection.query("insert ignore into buyers(First_name,Last_Name,House,Email,Name_Product,Count_in_Order,Order_id) values ('" + req.body.first_name + "','" + req.body.last_name + "','" + req.body.house + "','" + req.body.email + "','" + req.body.name + "'," + req.body.count + ",0);", function (err, results) {
            res.redirect("/?res=0");
          });
        else
          connection.query("insert ignore into buyers(First_name,Last_Name,House,Email,Name_Product,Count_in_Order,Order_id) values ('" + req.body.first_name + "','" + req.body.last_name + "','" + req.body.house + "','" + req.body.email + "','" + req.body.name + "'," + req.body.count + "," + parseInt(result[0]['max(Order_id)'] + 1) + ");", function (err, results) {
            res.redirect("/?res=" + parseInt(result[0]['max(Order_id)'] + 1));
          });
      });
    else
      res.redirect("/?res=-1");
  });
});
app.post("/purchased_all", function (req, res) {
  connection.query(select_product + ";", function (err, results) {
    let cookie = Object.keys(req.cookies);
    let count = false;
    for (i of results)
      if (cookie.indexOf(i.Name) >= 0 && i.Count - parseInt(req.cookies[i.Name]) >= 0)
        count = true;
    if (count == true) {
      connection.query("select max(Order_id) from buyers;", function (err, result) {
        let sql = "insert ignore into buyers(First_name,Last_Name,House,Email,Name_Product,Count_in_Order,Order_id) values ";
        for (i of cookie) {
          connection.query("UPDATE product set Count = Count -" + req.cookies[i] + " where Count-" + req.cookies[i] + ">=0 and Name='" + i + "';");
          if (result[0]['max(Order_id)'] == null)
            sql += "('" + req.body.first_name + "','" + req.body.last_name + "','" + req.body.house + "','" + req.body.email + "','" + i + "'," + req.cookies[i] + ",0)";
          else
            sql += "('" + req.body.first_name + "','" + req.body.last_name + "','" + req.body.house + "','" + req.body.email + "','" + i + "'," + req.cookies[i] + "," + parseInt(result[0]['max(Order_id)'] + 1) + ")";
        }
        sql += ";";
        connection.query(sql);
        if (result[0]['max(Order_id)'] == null)
          res.redirect("/?res=0");
        else
          res.redirect("/?res=" + parseInt(result[0]['max(Order_id)'] + 1));
      });
    }
    else
      res.redirect("/?res=-1");
  });
});
app.get("*", function (request, response) {
  response.send(request.url)
});
app.listen(3000, () => {
  console.log('Application listening on port 3000!');
});