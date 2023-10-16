var status = 0;
let readline = require('readline');
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>'
});


rl.prompt();

    if (status == 0) {
        console.log('Введите количество букв в слове');
        //rl.prompt();
        status+=1;
    }

rl.on('line', (input) => {
    input = input.toLowerCase();
    console.log(input);
    rl.close();
});