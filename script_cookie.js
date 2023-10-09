document.cookie=decodeURIComponent(document.cookie);
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
    let input = document.getElementById(id);
    var button = document.getElementById("buy_button");
    var cards = document.querySelectorAll(".card");
    if (document.cookie == '')
        document.cookie = 'item={}';
    let json_cookie = JSON.parse(document.cookie.slice(5));
    if (json_cookie.item !== undefined) {
        let index = json_cookie.item.indexOf(name);
        if (parseInt(input.value) == 0 && basket == true) {
            json_cookie.count.splice(index, 1);
            json_cookie.item.splice(index, 1);
            for (j of cards)
                if (j.id == "card_" + input.id) {
                    j.remove();
                }
            if (json_cookie.item.length == 0)
                button.style["display"] = 'none';
        }
        else if (index != -1 && basket == false && parseInt(input.value) + json_cookie.count[index] <= parseInt(input.max))
            json_cookie.count[index] += parseInt(input.value);
        else if (index == -1 && parseInt(input.value) <= parseInt(input.max)) {
            json_cookie.item.push(name);
            json_cookie.count.push(parseInt(input.value));
        }
        else if (index != -1 && basket == true && parseInt(input.value) <= parseInt(input.max)) {
            json_cookie.count[index] = parseInt(input.value);
        }
    }
    else {
        json_cookie.item = [];
        json_cookie.count = [];
        if (basket == false && parseInt(input.value) <= parseInt(input.max)) {
            json_cookie.item.push(name);
            json_cookie.count.push(parseInt(input.value));
        }
    }
    document.cookie = "item=" + JSON.stringify(json_cookie);
}