//made by chkrr00k

var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var mv = require('mv');
var express = require('express');
var path = require('path');

var app = express();

app.use(express.static("public"));
app.use(express.json())

app.get('/d', (req, res) => {
        res.sendFile(__dirname + '/public/download.html');
});

app.get('/u', (req, res) => {
        res.sendFile(__dirname + '/public/upload.html');
});

app.get('/', (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
});

app.post('/upload', (req, res) => {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
                var oldpath = files.file.path;
                var newpath = "./folder/" + files.file.name;
                mv(oldpath, newpath, function (err) {
                        if (err) {
                                res.status(409);
                        }else{
                                res.write('File uploaded and moved!');
                        }
                        res.end();
                });
        });
});

app.post('/list', (req, res) => {
        fs.readdir("./folder/", (err, files) => {
                res.json(files);
                res.end();
        });
});

app.get('/download/:file(*)', (req, res) => {
        let name = req.params.file;
        let loc = path.join('./folder/', name);
        res.download(loc, name);
});


var server = http.createServer(app);

server.listen(8888, "0.0.0.0");
