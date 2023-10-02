var xhr = new XMLHttpRequest();
xhr.open("POST", "/id", "true");
xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
xhr.send(JSON.stringify({ "id": localStorage.getItem("id") }));
xhr.onload = function () { localStorage.setItem("id", JSON.parse(xhr.response).id); }