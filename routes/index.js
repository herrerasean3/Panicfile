var express = require('express');
var router = express.Router();
let pgp = require('pg-promise')();
let connString = process.env.DATABASE_URL;
let dbase = pgp(connString);
var fs = require('fs');

var db = require('../db/queries');

var multer = require('multer')

var upload = multer({
  dest: __dirname + '/../public/files/',
  limits: {fileSize: 20971520, files: 1},
})

function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  if (i === 0) return `${bytes} ${sizes[i]})`
  return `${(bytes / (Math.pow(1024, i))).toFixed(1)} ${sizes[i]}`
}


/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Gundam API' });
});*/

router.get('/', db.getAllFiles);

router.get('/download', function(req, res){
  var file = __dirname + `/../public/files/${req.query.renamed}`;
  var newname = `${req.query.filename}`;
  res.download(file, newname);
});

//Upload Functionality
router.post('/upload', upload.single('upload'), function(req, res) {
  let filesize = bytesToSize(req.file.size);
  console.log(bytesToSize(req.file.size))
	dbase.none('INSERT INTO filelist(filename, renamed, filesize, category)' + 'VALUES(${originalname}, ${filename},'+ `'${filesize}', '${req.body.cat}')`, req.file)
	.then(
    res.status(200),
    setTimeout(res.redirect('/'), 200000)
		)
});

router.get('/delete', db.deleteFile);

router.get('/search', db.searchFile);

module.exports = router;