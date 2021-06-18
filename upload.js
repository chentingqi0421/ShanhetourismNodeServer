// const http = require("http");
// const querystring = require("querystring");
// const Mock = require('mockjs');
const bodyParser = require('body-parser');
const fs = require('fs');
const express = require('express');

var app = express();

app.all("*", function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
var urlencodedParser = bodyParser.urlencoded({
	extended: true
});

app.post('/api/updateAvatar', urlencodedParser, function(req, res) {
	var imgData = req.body.serverBase64Img;
	var base64Data = imgData.replace(/^data:image\/\w+;base64,/, '')
	var dataBuffer = new Buffer(base64Data, 'base64');
	fs.writeFile('./images/image.png', dataBuffer, function(err) {
		if (err) return
		console.log('图片保存成功')
	})

});



