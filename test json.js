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
function check_basket(results) {
  var file = JSON.parse(fs.readFileSync("info.json", "utf8"));
  for (i of file)
    for (j of results)
      if (i.basket) {
        let index = i.basket.indexOf(j.Name);
        if (index >= 0 && i.count[index] > j.Count)
          i.count[index] = j.Count;
        if (i.count[index] == 0) {
          i.count.splice(index, 1);
          i.basket.splice(index, 1);
        }
      }
  fs.writeFileSync("info.json", JSON.stringify(file));
  return file;
}
app.get('/', function (req, res) {
  if (!req.query.res)
    res.render(__dirname + '/сайт/index.ejs');
  else if (req.query.res >= 0)
    res.render(__dirname + '/сайт/index.ejs', { Id: "Ваш номер заказа " + req.query.res + ". Вам выслано электронное письмо на почту." });
  else if (req.query.res == -1)
    res.render(__dirname + '/сайт/index.ejs', { Id: "Нужного количества товара не осталось." });
});
app.get('/shop', function (req, res) {
  connection.query(select_product + ";",
    function (err, results) {
      check_basket(results);
      if (err) console.log(err);
      else
        res.render(__dirname + '/сайт/item.ejs', { Results: results });
    });
});
app.get('/basket', function (req, res) {
  connection.query("select * from product where;", function (err, results) {
    var file = JSON.parse(fs.readFileSync("info.json", "utf8"));
    for (i of file) {
      if (i.id == parseInt(req.query.id)) {
        res.render(__dirname + '/сайт/basket.ejs', { user_info: i, Results: results });
        return;
      }
    }
    res.render(__dirname + '/сайт/basket.ejs', {});
  });
});
app.get("/basket/buy", function (req, res) {
  connection.query(select_product + ";",
    function (err, results) {
      var file = check_basket(results);
      for (i of file)
        if (i.id == req.query.id)
          res.render(__dirname + '/buy.ejs', { Results: i, multi: true });
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
    let count = true;
    var file = JSON.parse(fs.readFileSync("info.json", "utf8"));
    for (i of results)
      for (j of file) {
        if (j.id == req.body.id) {
          if (j.basket.includes(i["Name"]) && i["Count"] - j.count[j.basket.indexOf(i["Name"])] < 0)
            count = false;
        }
      }
    if (count == true) {
      connection.query("select max(Order_id) from buyers;", function (err, result) {
        for (i of file)
          if (i.id == req.body.id) {
            for (j = 0; j < i.basket.length; j++)
              connection.query("UPDATE product set Count = Count -" + i.count[j] + " where Count-" + i.count[j] + ">=0 and Name='" + i.basket[j] + "';");
            let sql = "insert ignore into buyers(First_name,Last_Name,House,Email,Name_Product,Count_in_Order,Order_id) values ";
            for (j = 0; j < i.basket.length; j++) {
              if (result[0]['max(Order_id)'] == null)
                sql += "('" + req.body.first_name + "','" + req.body.last_name + "','" + req.body.house + "','" + req.body.email + "','" + i.basket[j] + "'," + i.count[j] + ",0)";
              else
                sql += "('" + req.body.first_name + "','" + req.body.last_name + "','" + req.body.house + "','" + req.body.email + "','" + i.basket[j] + "'," + i.count[j] + "," + parseInt(result[0]['max(Order_id)'] + 1) + ")";
              if (j < i.basket.length - 1)
                sql += ",";
            }
            sql += ";";
            connection.query(sql);
            i.basket = [];
            i.count = [];
          }
        fs.writeFileSync("info.json", JSON.stringify(file));
        if (result[0]['max(Order_id)'] == null)
          res.redirect("/?res=0");
        else
          res.redirect("/?res=" + parseInt(result[0]['max(Order_id)'] + 1));
      });
    }
  });
});
app.post("/id", function (req, res) {
  var file = JSON.parse(fs.readFileSync("info.json", "utf8"));
  if (req.body.id == null) {
    file.push({ "id": file.length });
    fs.writeFileSync("info.json", JSON.stringify(file));
    res.send({ "id": file.length - 1 });
  }
  else {
    let count = file.some(i => i.id == req.body.id);
    if (count == false) {
      file.push({ "id": parseInt(req.body.id) });
      fs.writeFileSync("info.json", JSON.stringify(file));
    }
    res.send({ "id": parseInt(req.body.id) });
  }
});
app.post("/basket_user", function (req, res) {
  var file = JSON.parse(fs.readFileSync("info.json", "utf8"));
  for (i of file)
    if (i.id == req.body.id) {
      res.send(i);
      return;
    }
});
app.post("/update_basket", function (req, res) {
  connection.query(select_product + " where Name='" + req.body.name + "';", function (err, result) {
    var file = JSON.parse(fs.readFileSync("info.json", "utf8"));
    req.body.count = Math.abs(req.body.count);
    for (i of file) {
      if (i.id == req.body.id) {
        if (i.basket === undefined) {
          i.basket = [];
          i.count = [];
        }
        let index = i.basket.indexOf(req.body.name);
        if (index == -1) {
          if (result[0]["Count"] - req.body.count >= 0) {
            i.basket.push(req.body.name);
            i.count.push(req.body.count);
          }
        }
        else if (req.body.method == 'add') {
          if (req.body.count + i.count[index] <= result[0]["Count"])
            i.count[index] += req.body.count;
          else
            i.count[index] = result[0]["Count"];
        }
        else if (req.body.method == 'delete') {
          if (i.count[index] - req.body.count > 0)
            i.count[index] -= req.body.count;
          else {
            i.count[index] = 0;
            i.count.splice(index, 1);
            i.basket.splice(index, 1);
          }
        }
        res.send(i);
      }
    }
    fs.writeFileSync("info.json", JSON.stringify(file));
  });
});
app.get("*", function (request, response) {
  response.send(request.url)
});
app.listen(3000, () => {
  console.log('Application listening on port 3000!');
});