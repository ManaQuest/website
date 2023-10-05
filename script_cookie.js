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
    else if (parseInt(input.max) == 0)
        input.value = 0;
    else if (parseInt(input.value) <= 0)
        input.value = 1;
}
function update_basket(id, name, basket) {
    let cards = document.querySelectorAll(".card");
    let input = document.getElementById(id);
    let button = document.getElementById("buy_button");
    let cookie = parseCookie();
    let index = -1;
    let value = parseInt(input.value);
    let max = parseInt(input.max);
    if (cookie != 0)
        index = cookie.indexOf(name);
    if (index != -1 && basket == false) {
        if (value + parseInt(cookie[index + 1]) <= max)
            document.cookie = `${name}=${value + parseInt(cookie[index + 1])}; `;
    }
    else if (basket == true || (input.value > 0 && input.max > 0))
        document.cookie = `${name}=${value}; `;
    if (value > max)
        input.value = input.max;
    else if ((input.value == 0 || input.max == 0) && basket == true) {
        document.cookie = `${input.id}=1;max-age=-1`;
        for (j of cards)
            if (j.id == "card_" + input.id)
                j.remove();
    }
    cards = document.querySelectorAll(".card");
    if (cards.length == 0)
        button.style.display = 'none';
}
function parseCookie() {
    if (document.cookie != "") {
        let cookie = document.cookie.split('(;|=) ');
        console.log(cookie);
        var cookie_arr = [];
        for (i of cookie) {
            cookie_arr.push(i.split("=")[0]);
            cookie_arr.push(i.split("=")[1]);
        }
    }
    else
        var cookie_arr = [];
    if (cookie_arr.length == 0)
        return 0;
    else
        return cookie_arr;
}
















function update_basket1(id, name, basket) {
    let cookie=parseCookie();
    if(cookie!=0){
        let index=cookie.indexOf(name);
        if(index!=-1 && basket==false && parseInt(input.value)+parseInt(cookie[index+1]<=parseInt(input.max)))
document.cookie="";
    }
    
}