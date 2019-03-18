const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws, req) {
    //if behind proxy
    //const ip = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0];
    console.log("connected to " + req.connection.remoteAddress + ":" + req.connection.remotePort + " over " + req.connection.remoteFamily);
    ws.on('message', function incoming(data) {
        console.log(data);
        obj = JSON.parse(data);
        mtr = ['./mtr']
        args = ['-p', '-c', '300']
        if(obj.no_dns) args.push('--no-dns')
        if(obj.protocol === 'TCP') args.push('-T')
        if(obj.protocol === 'UDP') args.push('-u')
        if(obj.version === '4') args.push('-4')
        if(obj.version === '6') args.push('-6')
        args.push(obj.hostname)
        console.log('Args array: ' + args.toString())

        var spawn = require('child_process').spawn;
        var prc = spawn(mtr[0], args);
        prc.stdout.setEncoding('utf8');
        prc.stdout.on('data', function(data) {
            //console.log(data)
            rdata = data.split(' ')
            //TODO: fix. display value as percentage
            //also displays weird in html.
            //alternativ rdata[4]/rdata[3]
            //rdata[2] = data[2]/1000
            ws.send(JSON.stringify(rdata))
        })
    });
});

/*
wss.on('message', function incoming(data) {
    console.log(data);
});
*/