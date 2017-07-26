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

//Called when a file is uploaded. Uses the filesize from multer's API to convert from Bytes to a proper filesize.
function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  if (i === 0) return `${bytes} ${sizes[i]}`
  return `${(bytes / (Math.pow(1024, i))).toFixed(1)} ${sizes[i]}`
}



router.get('/', db.getAllFiles);

//Functionality for Downloading files.
//Uses the unique hash and stored filename from the database table to return a file with its original filename and extension. 
//Both the hash and filename are served up via querystrings.
router.get('/download', function(req, res){
  var file = __dirname + `/../public/files/${req.query.renamed}`;
  var newname = `${req.query.filename}`;
  res.download(file, newname);
});

//Upload Functionality
//multer handles the upload, simplifying what would otherwise be a bit more verbose with fs.
//Uses multer's API to convert the filesize using the above bytesToSize function, and also uses the API to record the converted file hash and the original filename for retrieval later.
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