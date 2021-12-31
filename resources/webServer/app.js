const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { unescape } = require('querystring');

const mineTypes = {
    'html':'text/html',
    'css' :'text/css',
    'js'  :'text/javascript',
    'png' :'image/png',
    'jpg' :'image/jpg',
    'jpeg':'image/jpeg'
};

const hostname = '127.0.0.1';
const port =  5000;

http.createServer((req,res) => {
    console.log(req.url);
    var myUri =  url.parse(req.url).pathname;
    var fileName = path.join(process.cwd(),unescape(myUri));
    console.log(`file you looking for it :${fileName}`);
    var loadFile;

    try {
        loadFile = fs.lstatSync(fileName);
    } catch (error) {
        res.writeHead(404,{'Content-Type':'text/plain'});
        res.write('<h1>404 Page not found</h1>');
        res.end();
        return;
    }

    if(loadFile.isFile()){
        var mimeType = mineTypes[path.extname(fileName).split('.').reverse()[0]] 
        res.writeHead(200,{'Content-Type': mimeType});
        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    }else if(loadFile.isDirectory()){
        res.writeHead(302 ,{'Location':'index.html'});
        res.end();
    }else{
        res.writeHead(500,{'Content-Type':'text/plain'});
        res.write('<h1>500 internal error</h1>');
        res.end();
    }
}).listen(port ,hostname , () => {
    console.log(`server is running at http://${hostname}:${port}`);
})
