const mysql = require("mysql2");
const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");
cookieParser = require('cookie-parser');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
var select_product = "select * from product";
var max_count = [];

const connection = mysql.createConnection({
  host: "localhost",
  port: "3030",
  user: "root",
  password: "12345",
  database: "shop"
});

connection.query(select_product + ";",
  function (err, results) {
    max_count = results;
  });

app.get('/', function (req, res) {
  connection.query("select * from news ORDER BY Id DESC LIMIT 0, 3;",
    function (err, results) {
      if (!req.query.res)
        res.render(__dirname + '/сайт/start.ejs', { name: 'index', Results: results, full: null });
      else if (req.query.res >= 0)
        res.render(__dirname + '/сайт/start.ejs', { name: 'index', Id: "Ваш номер заказа " + req.query.res + ". Вам выслано электронное письмо на почту.", Results: results, full: false });
      else if (req.query.res == -1)
        res.render(__dirname + '/сайт/start.ejs', { name: 'index', Id: "Нужного количества товара не осталось.", Results: results, full: false, status: "" });
    });
});
app.get('/shop', function (req, res) {
  res.render(__dirname + '/сайт/start.ejs', { name: 'item', Results: max_count });
});
app.get('/news', function (req, res) {
  let count_page = 3;
  connection.query("select * from news ORDER BY Id DESC;",
    function (err, results) {
      let page_news = [];
      let status = "";
      for (let i = req.query.page * count_page; i < (parseInt(req.query.page) + 1) * count_page; i++) {
        if (results[i] !== undefined)
          page_news.push(results[i]);
        if ((parseInt(req.query.page) + 2) * count_page > results.length && (parseInt(req.query.page) + 2) * count_page - results.length >= count_page)
          status = "max";
        else if ((parseInt(req.query.page) - 1) * count_page < 0)
          status = "min";
      }
      if (parseInt(req.query.page) < 0)
        res.redirect("/news?page=0");
      else if (page_news.length == 0) {
        let count = 0;
        while ((count + 2) * count_page <= results.length)
          count++;
        
        if ((count + 2) * count_page - results.length < count_page)
          count++;
        res.redirect("/news?page=" + count);
      }
      else
        res.render(__dirname + '/сайт/start.ejs', { name: 'news', Results: page_news, full: false, page: req.query.page, status: status });
    });
});
app.get('/NotFound', function (req, res) {
  res.render(__dirname + '/сайт/start.ejs', { name: 'Not Found' });
});
app.get('/news/:id', function (req, res) {
  connection.query("select * from news;",
    function (err, results) {
      let count = false;
      for (i of results)
        if (req.params['id'] == i.Id) {
          count = true;
          res.render(__dirname + '/сайт/start.ejs', { name: 'news', Results: [results], full: true });
        }
      if (count == false)
        res.redirect("/NotFound");
    });
});
app.get('/basket', function (req, res) {
  if (Object.keys(req.cookies).length == 0) {
    res.cookie('item', '{"item":[],"count":[]}');
    res.render(__dirname + '/сайт/start.ejs', { name: 'basket', user_info: { "item": '{"item":[],"count":[]}' }, Results: max_count });
  }
  else
    res.render(__dirname + '/сайт/start.ejs', { name: 'basket', user_info: req.cookies, Results: max_count });
});
app.get('/payment', function (req, res) {
  res.render(__dirname + '/сайт/start.ejs', { name: 'payment' });
});
app.get("/basket/buy", function (req, res) {
  if (Object.keys(req.cookies).length == 0) {
    res.cookie('item', '{"item":[],"count":[]}');
    res.render(__dirname + '/сайт/start.ejs', { name: 'buy', Results: max_count, cookie: { "item": '{"item":[],"count":[]}' }, params: req.query });
  }
  else
    res.render(__dirname + '/сайт/start.ejs', { name: 'buy', Results: max_count, cookie: req.cookies, params: req.query });
});
app.get("/:nameId/info", function (req, res) {
  for (i of max_count)
    if (i.Name == req.params['nameId'])
      res.render(__dirname + '/сайт/start.ejs', { name: 'info', Results: max_count, cookie: i });
});
app.get("/:nameId/buy", function (req, res) {
  for (i of max_count)
    if (i.Name == req.params['nameId']) {
      let cookie = { "item": [], "count": [] };
      cookie.item.push(i.Name);
      cookie.count.push(req.query.count);
      cookie = { "item": JSON.stringify(cookie) };
      res.render(__dirname + '/сайт/start.ejs', { name: 'buy', Results: max_count, cookie: cookie, params: req.query });
    }
});
app.get("/*.js", function (req, res) {
  res.sendFile(__dirname + req.url);
});
app.get("/*.css", function (req, res) {
  res.sendFile(__dirname + req.url);
});
app.post("/purchased", function (req, res) {
  connection.query("UPDATE product set Count = Count -" + req.body.count + " where Count-" + req.body.count + ">=0 and Name='" + req.body.name + "';", function (request, response) {
    if (response['changedRows'] == 1)
      connection.query("select max(Order_id) from buyers;", function (err, result) {
        if (result[0]['max(Order_id)'] == null)
          connection.query("insert ignore into buyers(First_name,Last_Name,House,Email,Name_Product,Count_in_Order,Order_id) values ('" + req.body.first_name + "','" + req.body.last_name + "','" + req.body.house + "','" + req.body.email + "','" + req.body.name + "'," + req.body.count + ",0);", function (err, results) {
            res.cookie('item', '{"item":[],"count":[]}');
            res.redirect("/?res=0");
          });
        else
          connection.query("insert ignore into buyers(First_name,Last_Name,House,Email,Name_Product,Count_in_Order,Order_id) values ('" + req.body.first_name + "','" + req.body.last_name + "','" + req.body.house + "','" + req.body.email + "','" + req.body.name + "'," + req.body.count + "," + parseInt(result[0]['max(Order_id)'] + 1) + ");", function (err, results) {
            res.cookie('item', '{"item":[],"count":[]}');
            res.redirect("/?res=" + parseInt(result[0]['max(Order_id)'] + 1));
          });
      });
    else {
      res.cookie('item', '{"item":[],"count":[]}');
      res.redirect("/?res=-1");
    }
    connection.query(select_product + ";",
      function (err, results) {
        max_count = results;
      });
  });
});
app.post("/purchased_all", function (req, res) {
  connection.query(select_product + ";", function (err, results) {
    let cookie = JSON.parse(req.cookies.item)
    let count = false;
    for (i of results)
      if (cookie.item.indexOf(i.Name) >= 0 && i.Count - parseInt(cookie.count[cookie.item.indexOf(i.Name)]) >= 0)
        count = true;
    if (count == true) {
      connection.query("select max(Order_id) from buyers;", function (err, result) {
        let body = req.body;
        let sql = "insert ignore into buyers(First_name,Last_Name,House,Email,Name_Product,Count_in_Order,Order_id) values ";
        for (i of cookie.item) {
          let index = cookie.item.indexOf(i);
          connection.query("UPDATE product set Count = Count -" + cookie.count[index] + " where Count-" + cookie.count[index] + ">=0 and Name='" + i + "';");
          if (result[0]['max(Order_id)'] == null)
            sql += "('" + body.first_name + "','" + body.last_name + "','" + body.house + "','" + body.email + "','" + i + "'," + cookie.count[index] + ",0),";
          else
            sql += "('" + body.first_name + "','" + body.last_name + "','" + body.house + "','" + body.email + "','" + i + "'," + cookie.count[index] + "," + parseInt(result[0]['max(Order_id)'] + 1) + "),";
        }
        sql = sql.slice(0, -1);
        sql += ";";
        connection.query(sql);
        connection.query(select_product + ";",
          function (err, results) {
            max_count = results;
          });
        res.cookie('item', '{"item":[],"count":[]}');
        if (result[0]['max(Order_id)'] == null)
          res.redirect("/?res=0");
        else
          res.redirect("/?res=" + parseInt(result[0]['max(Order_id)'] + 1));
      });
    }
    else {
      res.cookie('item', '{"item":[],"count":[]}');
      res.redirect("/?res=-1");
    }
  });
});
app.get("*", function (request, response) {
  response.send(request.url)
});
app.listen(3000, () => {
  console.log('Application listening on port 3000!');
});