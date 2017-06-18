var express = require('express');
var router = express.Router();
let pgp = require('pg-promise')();
let connString = process.env.DATABASE_URL;
let dbase = pgp(connString);

var db = require('../db/queries');

var multer = require('multer')

var upload = multer({
  dest: __dirname + '/../public/files/',
  limits: {fileSize: 10000000, files: 1},
})

function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  if (i === 0) return `${bytes} ${sizes[i]})`
  return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
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

router.get('/people/:id', db.getOneCast);

//Upload Functionality
router.post('/upload', upload.single('upload'), function(req, res) {
  let filesize = bytesToSize(req.file.size);
  console.log(bytesToSize(req.file.size))
	dbase.none('INSERT INTO filelist(filename, renamed, filesize, category)' + 'VALUES(${originalname}, ${filename},'+ `'${filesize}', '${req.body.cat}')`, req.file)
	.then(
    res.status(200),
    setTimeout(res.redirect('/'), 100000)
		)
});

router.delete('/people/:id', db.deleteCast);

module.exports = router;