/*const fs = require("fs");
var arr = [[25, 25, 25], [25, 25, 25], [25, 25, 25]];
var predel = 100;
var count = false;
sum = [0, 0, 0, 0, 0, 0, 0, 0];
check = true;
a = false;
namee = 'd.json';
var file = JSON.parse(fs.readFileSync(namee, "utf8"));
if (file['count'] != undefined)
    arr = file['count'];
while (true) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            sum[i] += Math.pow(arr[i][j], 2);
            sum[i + arr.length] += Math.pow(arr[j][i], 2);
        }
        sum[6] += Math.pow(arr[i][i], 2);
        sum[7] += Math.pow(arr[2 - i][i], 2);
    }
    for (let i = 0; i < sum.length; i++) {
        if (sum[0] != sum[i]) {
            check = false;
            break;
        }
    }
    if (check == true) {
        console.log("Квадрат найден", arr);
        if (file['solve'] == undefined)
            file['solve'] = 1;
        else
            file['solve'] += 1;
        file[file['solve']] = [];
        for (let i = 0; i < arr.length; i++)
            file[file['solve']].push(arr[i].slice(0));
    }
    check = true;
    sum = [0, 0, 0, 0, 0, 0, 0, 0];
    if (count == true)
        break;
    count = true;
    arr[2][2] += 1;
    for (let i = arr.length - 1; i >= 0; i--) {
        for (let j = arr.length - 1; j >= 0; j--) {
            if (arr[i][j] == predel + 1) {
                arr[i][j] = 1;
                if (j > 0)
                    arr[i][j - 1] += 1;
                if (j == 0 && i > 0) {
                    arr[i - 1][arr[i].length - 1] += 1;
                    a = true;
                }
            }
        }
    }
    if (a == true) {
        a = false;
        file['count'] = arr;
        fs.writeFileSync(namee, JSON.stringify(file));
        console.log(arr);
    }
    for (let i = 0; i < arr.length; i++)
        for (let j = 0; j < arr[0].length; j++)
            if (arr[i][j] != predel) {
                count = false;
                break;
            }
}



*/













const fs = require("fs");
var arr = [50, 50, 50, 50, 50, 50, 50, 50, 50];
namee = 'd.json';
var file = JSON.parse(fs.readFileSync(namee, "utf8"));
if (file['count'] != undefined)
    arr = file['count'];
var predel = 100;
sum = [0, 0, 0, 0, 0, 0, 0, 0];
check = true;
count = false;
a = false;
while (true) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            sum[i] += Math.pow(arr[j + i * 3], 2);
            sum[i + 3] += Math.pow(arr[j * 3 + i], 2);
        }
        if (sum[i] != sum[i + 3]) {
            check = false;
            break;
        }
        sum[6] += Math.pow(arr[i + i * 3], 2);
        sum[7] += Math.pow(arr[i * 2 + 2], 2);
    }
    if(check==false && arr[8]+1<predel){
        count=false;
        arr[8] += 1;
        continue;
    }
    for (let i = 0; i < 8 && check == true; i++)
        if (sum[0] != sum[i]) {
            check = false;
            break;
        }
    if (check == true) {
        console.log("Квадрат найден", arr);
        if (file['solve'] == undefined)
            file['solve'] = 1;
        else
            file['solve'] += 1;
        file[file['solve']] = arr.slice(0);
    }
    arr[8] += 1;
    if (count == true)
        break;
    count = true;
        for (let i = 8; i >= 0; i--) {
            if (arr[i] >= predel + 1) {
                arr[i] = 1;
                arr[i - 1] += 1;
                if (i == 5)
                    a = true;
            }
            if (arr[i] < predel)
                count = false;
        }
    if (a == true) {
        a = false;
        file['count'] = arr;
        fs.writeFileSync(namee, JSON.stringify(file));
        console.log(arr);
    }
}





/*[
    1, 1, 3, 41, 80,
    1, 1, 1,  1
  ]*/


  