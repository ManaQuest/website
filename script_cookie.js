function change(id, method, basket) {
    var input = document.getElementById(id);
    if (method == 'add') {
        if (parseInt(input.value) < parseInt(input.max))
            input.value = parseInt(input.value) + 1;
    }
    else
        if (input.value > 1)
            input.value = parseInt(input.value) - 1;
        else if (method == 'delete' && input.value >= 1 && basket == true)
            input.value = parseInt(input.value) - 1;
}
function check(id) {
    var input = document.getElementById(id);
    if (parseInt(input.value) > parseInt(input.max))
        input.value = parseInt(input.max);
    else if (parseInt(input.value) <= 0)
        input.value = 1;
}
function update_basket(id, name, method, basket) {
    let input = document.getElementById(id);
    let cookie = parseCookie();
    let change = false;
    console.log(input.value);
    if (cookie != 0)
        for (i of cookie)
            if (i[0] == name) {
                change = true;
                if (method = "add") {
                    if (parseInt(input.value) + parseInt(i[1]) <= input.max && basket == false)
                        document.cookie = `${name}=${parseInt(input.value) + parseInt(i[1])}`;
                }
                else
                    if (parseInt(i[1]) - parseInt(input.value) >= 0 && basket == false)
                        document.cookie = `${name}=${parseInt(i[1]) - parseInt(input.value)}`;
            }
    if (change == false || basket == true)
        document.cookie = `${name}=${parseInt(input.value)}`;
    if (input.value > input.max)
        input.value = input.max;
    else if (input.value == 0 || input.max == 0)
        document.cookie = `${input.id}=1;max-age=-1`;
    console.log(document.cookie);
}
function parseCookie() {
    let cookie = document.cookie.split("; ");
    let cookie_arr = [];
    for (i of cookie)
        cookie_arr.push(i.split("="));
    if (cookie_arr.length == 1 && cookie_arr[0] == '')
        return 0;
    else
        return cookie_arr;
}