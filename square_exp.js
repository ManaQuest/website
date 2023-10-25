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
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function sum_t() {
    sum = get_sum();
    for (let i = 0; i < 8; i++)
        if (sum[0] != sum[i])
            return false;
    return true;
}
var arr = [[], [], []];
/*for (let i = 0; i < 3; i++)
    console.log(matrix[i]);*/
function change(m, m_pred, sum) {
    var sum_l = Math.pow(m[0], 2) + Math.pow(m[1], 2) + Math.pow(m[2], 2);
    for (let a = 0; a < 1; a++) {
        var arr = [[], [], []];
        for (let i = 1; i < 101; i++) {
            arr[0].push((m[0] + i) * (i - m[0]));
            arr[1].push((m[1] + i) * (i - m[1]));
            arr[2].push((m[2] + i) * (i - m[2]));
        }
        for (let i = 0; i < 100; i++)
            for (let j = 0; j < 100; j++)
                for (let s = 0; s < 100; s++)
                    if (arr[0][i] + arr[1][j] + arr[2][s] == sum - sum_l) {
                        if ((i + 1) != m_pred[0]) {
                            if (m.length != 4) {
                                m[0] = i + 1;
                                m[1] = j + 1;
                                m[2] = s + 1;
                            }
                            else if (m.length == 4 && arr[1][j] == 0 && m[3] == 0) {
                                m[0] = i + 1;
                                m[1] = j + 1;
                                m[2] = s + 1;
                            }
                            else if (m.length == 4 && arr[0][i] == 0 && m[3] == 1) {
                                m[0] = i + 1;
                                m[1] = j + 1;
                                m[2] = s + 1;
                            }
                            else if (m.length == 4 && arr[1][j] == 0 && m[3] == 2) {
                                m[0] = i + 1;
                                m[1] = j + 1;
                                m[2] = s + 1;
                            }
                            //console.log(i + 1, j + 1, s + 1);
                        }
                    }
    }
    if (m.length == 4)
        m.pop();
    return m;
}
var matrix = [
    [34, 47, 69],
    [62, 42, 50],
    [60, 52, 36]];
/*get_sum();
matrix[1] = change(matrix[1], matrix[0], sum[0]);
get_sum();
matrix[2] = change(matrix[2], matrix[1], sum[1]);
get_sum();
for (let i = 0; i < 3; i++)
    console.log(matrix[i]);
console.log(sum);
var aa = change([matrix[0][0], matrix[1][0], matrix[2][0], 0], matrix[2], sum[2]);
get_sum();
matrix[1] = change([...matrix[1], 0], matrix[0], sum[0]);
for (let i = 0; i < 3; i++)
    matrix[i][0] = aa[i];
get_sum();
matrix[1] = change([...matrix[1],1], matrix[0], sum[0]);
get_sum();
matrix[2] = change([...matrix[2],1], matrix[1], sum[1]);
get_sum();
matrix[1] = change(matrix[1], matrix[0], sum[0]);*/
/*var matrix=[[ 6, 62, 31 ],
[ 1, 14, 24 ],
[ 91, 12, 91 ]];*/
var matrix = [[ 12, 68, 92 ],
[ 92, 12, 68 ],
[ 68, 92, 12 ]];
for (let f = 0; f < 100; f++) {
    console.log("Новый массив");
    var matrix = [];
    for (let i = 0; i < 3; i++) {
        matrix.push([]);
        for (let j = 0; j < 3; j++)
            matrix[i].push(getRandomInt(100));
    }
    get_sum();
    for (let i = 0; i < 3; i++)
        console.log(matrix[i]);
    var aa = change([matrix[0][1], matrix[1][1], matrix[2][1], 0], matrix[1], sum[1]);
    for (let i = 0; i < 3; i++)
        matrix[i][1] = aa[i];
    get_sum();
    matrix[0] = change([...matrix[0], 2], matrix[1], sum[1]);
    get_sum();
    matrix[2] = change([...matrix[2], 2], matrix[1], sum[1]);
    get_sum();
    for (let i = 0; i < 3; i++)
        console.log(matrix[i]);
    console.log(sum);
    var arr = [[], [], [], []];
    for (let i = 1; i < 101; i++) {
        arr[0].push((matrix[0][0] + i) * (i - matrix[0][0]));
        arr[1].push((matrix[0][2] + i) * (i - matrix[0][2]));
        arr[2].push((matrix[2][0] + i) * (i - matrix[2][0]));
        arr[3].push((matrix[2][2] + i) * (i - matrix[2][2]));
    }
    for (let i = 0; i < 100; i++)
        for (let j = 0; j < 100; j++)
            for (let s = 0; s < 100; s++)
                for (let g = 0; g < 100; g++) {
                    matrix[0][0] = i + 1;
                    matrix[0][2] = j + 1;
                    matrix[2][0] = s + 1;
                    matrix[2][2] = g + 1;
                    if (sum_t() == true)
                        console.log(i, j, s, g, "sdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                }
    for (let i = 0; i < 3; i++)
        console.log(matrix[i]);
    get_sum();
    console.log(sum);
}