
var http = require('http');
var util = require('util');
var url  = require('url');
var os   = require('os');

var server = http.createServer();
server.on('request', function(req, res) {
    var requrl = url.parse(req.url, true);
    if (requrl.pathname === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(
            ["<html><head><title>Hello, world!</title></head>",
             "<body><h1>Hello, world!</h1>",
             "<p><a href='/osinfo'>OS Info</a></p>",
             "</body></html>"]
            .join('\n')
        );
    } else if (requrl.pathname === "/osinfo") {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(
            ["<html><head><title>Operating System Info</title></head>",
             "<body><h1>Operating System Info</h1>",
             "<table>",
             "<tr><th>TMP Dir</th><td>{tmpdir}</td></tr>",
             "<tr><th>Host Name</th><td>{hostname}</td></tr>",
             "<tr><th>OS Type</th><td>{ostype} {osplat} {osarch} {osrelease}</td></tr>",
             "<tr><th>Uptime</th><td>{uptime} {loadavg}</td></tr>",
             "<tr><th>Memory</th><td>total: {totalmem} free:{freemem}</td></tr>",
             "<tr><th>CPU's</th><td><pre>{cpudata}</pre></td></tr>",
             "<tr><th>Network</th><td><pre>{netdata}</pre></td></tr>",
             "</table>",
             "</body></html>"]
            .join('\n')
            .replace("{tmpdir}", os.tmpDir())
            .replace("{hostname}", os.hostname())
            .replace("{ostype}", os.type())
            .replace("{osplat}", os.platform())
            .replace("{osarch}", os.arch())
            .replace("{osrelease}", os.release())
            .replace("{uptime}", os.uptime())
            .replace("{loadavg}", util.inspect(os.loadavg()))
            .replace("{totalmem}", os.totalmem())
            .replace("{freemem}", os.freemem())
            .replace("{cpudata}", util.inspect(os.cpus()))
            .replace("{netdata}", util.inspect(os.networkInterfaces()))
        );
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end("bad URL "+ req.url);
    }
});

server.listen(8124);
console.log('listening to http://localhost:8124');