const Client = require('mpp-client-xt');
const fs = require('fs');

var pos = {x: 50, y: 50};
var vel = {x: 2/5, y: 2/7};

var client = new Client("wss://www.multiplayerpiano.com:443");

client.start();

stats = require('./stats.json');

save = () => {
    fs.writeFile('./stats.json', JSON.stringify(stats), () => {});
}

client.on('hi', () => {
    console.log("Hi!");
    client.setChannel("✧𝓡𝓟 𝓡𝓸𝓸𝓶✧");
});

cursorfunc = () => {
    pos.x += vel.x;
    pos.y += vel.y;
    if ((pos.x >= 100 && vel.x > 0) || (pos.x <= 0 && vel.x < 0)) {
        vel.x = -vel.x;
        stats.w += 1;
        save();
    }
    if ((pos.y >= 100 && vel.y > 0) || (pos.y <= 0 && vel.y < 0)) {
        vel.y = -vel.y;
        stats.w += 1;
        save();
    }
    if ((pos.x <= 0 && pos.y <= 0) || (pos.x >= 100 && pos.y <= 0) || (pos.x >= 100 && pos.y >= 100) || (pos.x <= 0 && pos.y >= 100)) {
        stats.c += 1;
        client.sendArray([{m: 'a', message: "Corner hit!"}]);
        save();
    }
    client.sendArray([{m: 'm', x: pos.x, y: pos.y}]);
}

cursor = setInterval(cursorfunc, 25);

client.on('a', msg => {
    let args = msg.a.split(' ');
    let cmd = args[0].toLowerCase();
    let argcat = msg.a.substring(cmd.length).trim();
    if (cmd == "dvd!stats") {
        client.sendArray([{m:'a', message:`┐ Corner hits: ${stats.c} | Wall hits: ${stats.w}`}]);
    }
});

cursorOn = () => {
    if (cursor) return false;
    cursor = setInterval(cursorfunc, 25);
    return true;
}

cursorOff = () => {
    if (!cursor) return false;
    clearInterval(cursor);
    return true;
}

/*
cursorCollide = client.on('m', p => {
    if (p._id == client.getOwnParticipant()._id) return;
    if ((pos.x > p.x - 5 && vel.x > 0) || (pos.x < p.x + 5 && vel.x < 0)) {
        vel.x = -vel.x;
    }

    if ((pos.y > p.y - 5 && vel.y > 0) || (pos.y < p.y + 5 && vel.y < 0)) {
        vel.y = -vel.y;
    }
});
*/