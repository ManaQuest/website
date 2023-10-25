function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
for (let x = 1; x < 100; x++) {
    if (Math.pow(x, 2) + Math.pow(x + 2, 2) != (Math.pow(x + 1, 2) * 2) + 2) {
        console.log(x);
    }
    //console.log(Math.pow(x, 2) + Math.pow(x + 11, 2) - (Math.pow(x + 6, 2) + Math.pow(x + 5, 2)));
}
var arr = [];
for (let x = 1; x < 100; x++) {
    for (let j = 0; j < 100; j++)
        if (x == 1)
            if (j % 2 == 0) {
                arr.push(Math.pow(x, 2) + Math.pow(x + j, 2) - (Math.pow(x + j / 2, 2) + Math.pow(x + j / 2, 2)));
            }
            else
                arr.push(Math.pow(x, 2) + Math.pow(x + j, 2) - (Math.pow(x + Math.floor(j / 2) + 1, 2) + Math.pow(x + Math.floor(j / 2), 2)));
        else
            if (j % 2 == 0 && arr[j] != Math.pow(x, 2) + Math.pow(x + j, 2) - (Math.pow(x + j / 2, 2) + Math.pow(x + j / 2, 2))) {
                console.log(x, j, arr[j], Math.pow(x, 2) + Math.pow(x + j, 2) - (Math.pow(x + Math.floor(j / 2) + 1, 2) + Math.pow(x + Math.floor(j / 2), 2)));
            }
            else if (j % 2 == 1 && arr[j] != Math.pow(x, 2) + Math.pow(x + j, 2) - (Math.pow(x + Math.floor(j / 2) + 1, 2) + Math.pow(x + Math.floor(j / 2), 2)))
                console.log(arr[j], Math.pow(x, 2) + Math.pow(x + j, 2) - (Math.pow(x + Math.floor(j / 2) + 1, 2) + Math.pow(x + Math.floor(j / 2), 2)));
}
//for (let i = 0; i < 100; i++)
//console.log(i, arr[i]);
var matrix = [];
for (let i = 0; i < 3; i++) {
    matrix.push([]);
    for (let j = 0; j < 3; j++)
        matrix[i].push(getRandomInt(100));
}
/*var matrix = [
    [90, 65, 60],
    [70, 67, 71],
    [62, 50, 91]];*/
/*var matrix = [
    [46, 68, 36],
    [62, 42, 50],
    [60, 52, 36]];*/
var matrix = [
    [46, 68, 36],
    [62, 42, 50],
    [60, 52, 36]];
var sum = [0, 0, 0, 0, 0, 0, 0, 0];
function get_sum() {
    sum = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            sum[i] += Math.pow(matrix[i][j], 2);
            sum[i + 3] += Math.pow(matrix[j][i], 2);
        }
        sum[6] += Math.pow(matrix[i][i], 2);
        sum[7] += Math.pow(matrix[2 - i][i], 2);
    }
    return sum;
}
for (let s = 0; s < 10000; s++) {
    for (let i = 0; i < 2; i++) {
        sum = get_sum();
        if (sum[i] < sum[i + 1])
            for (let j = 0; j < 3; j++) {
                if (matrix[i][j] % 2 == 0)
                    matrix[i][j] += 2;
                else
                    matrix[i][j] += 1;
                if (matrix[i + 1][j] % 2 == 0)
                    matrix[i + 1][j] -= 2;
                else
                    matrix[i + 1][j] -= 1;
            }
        else if (sum[i] > sum[i + 1])
            for (let j = 0; j < 3; j++) {
                if (matrix[i + 1][j] % 2 == 0)
                    matrix[i + 1][j] += 2;
                else
                    matrix[i + 1][j] += 1;
                if (matrix[i][j] % 2 == 0)
                    matrix[i][j] -= 2;
                else
                    matrix[i][j] -= 1;
            }
    }
    for (let i = 0; i < 3; i++) {
        sum = get_sum();
        if (sum[i + 3] < sum[i + 4])
            for (let j = 0; j < 2; j++) {
                if (matrix[j][i] % 2 == 0)
                    matrix[j][i] += 2;
                else
                    matrix[j][i] += 1;
                if (matrix[j + 1][i] % 2 == 0)
                    matrix[j + 1][i] -= 2;
                else
                    matrix[j + 1][i] -= 1;
            }
        else
            for (let j = 0; j < 2; j++) {
                if (matrix[j + 1][i] % 2 == 0)
                    matrix[j + 1][i] += 2;
                else
                    matrix[j + 1][i] += 1;
                if (matrix[j][i] % 2 == 0)
                    matrix[j][i] -= 2;
                else
                    matrix[j][i] -= 1;
            }
    }
}
/*var matrix = [
    [34, 47,69],
    [62, 42, 50],
    [60, 52, 36]];*/
var matrix = [
    [34, 47, 69],
    [62, 42, 50],
    [60, 52, 36]];
var ar = [[], [], []];
for (let i = 0; i < 3; i++)
    console.log(matrix[i]);
function change(m,sum) {
    for (let a = 0; a < 10; a++) {
        ar = [[], [], []];
        let sum_l = Math.pow(m[0],2)+Math.pow(m[1],2)+Math.pow(m[2],2);
        for (let i = 1; i < 101; i++) {
            ar[0].push((m[0] + i) * (i - m[0]));
            ar[1].push((m[1] + i) * (i - m[1]));
            ar[2].push((m[2] + i) * (i - m[2]));
        }
        for (let i = 0; i < 100; i++)
            for (let j = 0; j < 100; j++)
                for (let s = 0; s < 100; s++)
                    if (ar[0][i] + ar[1][j] + ar[2][s] == sum - sum_l) {
                        if ((i + 1) != matrix[1][0]) {
                            m[0] = i + 1;
                            m[1] = j + 1;
                            m[2] = s + 1;
                        }
                    }
    }
}
sum = get_sum();
console.log(sum);
change(matrix[1],sum[0]);
change(matrix[2],sum[0]);
sum = get_sum();
for (let i = 0; i < 3; i++)
    console.log(matrix[i]);
console.log(sum);
/*[ 58, 106, 52 ]
[ 78, 74, 78 ]
[ 86, 2, 90 ]*/