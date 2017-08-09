//Loads pg-promise as a dependency for the script.
//Allows us to access our database via HTTP Requests.
let pgp = require('pg-promise')();
let connString = process.env.DATABASE_URL;
let db = pgp(connString);
var fs = require('fs');

//Whenever the index is loaded, calls this.
//Grabs the entire filelist, then orders said filelist by timestamp and id, descending.
//The idea is to have the most recent files at the top of the table.
function getAllFiles(req, res, next) {
  db.any('SELECT * FROM filelist ORDER BY uploaded DESC, file_id DESC')
    .then(function(data) {
      res.status(200)
      res.render('index', {data:data});
    })
    .catch(function(err) {
      return next(err);
    });
}

//Serves up a search term and category as querystrings, allowing us to sort.
//If the value of either querystring is null, it counts as a wildcard search.
//Satisfies R in CRUD, with additional filtering functionality.
function searchFile(req, res, next) {
  if (req.query.cat2 == "null") {
    req.query.cat2 = "";
  }
  let category = req.query.cat2;
  let search = req.query.searchterm;
    db.any(`SELECT * FROM filelist WHERE "category" ILIKE '%${category}%' AND "filename" ILIKE '%${search}%' ORDER BY uploaded DESC, file_id DESC`)
    .then(function(data) {
      console.log(data)
      res.render('index', {data:data});
    })
    .catch(function(err) {
      return next(err);
    });
}



// Deletes the row at the target ID. Simple enough.
// Satisfies D of CRUD.
// fs.unlinkSync deletes files from the server, but is currently bugged. When a file is deleted it will return an error upon successfully deleting. Don't ask.
function deleteFile(req, res, next) {
  let fileID = parseInt(req.query.fileid);
  fs.unlinkSync(`public/files/${req.query.renamed}`);
    db.result(`DELETE FROM filelist WHERE file_id = ${fileID}`)
    .then(function(result) {
      getAllFiles();
    })
    .catch(function(err) {
      getAllFiles();
    })
}

//CRUD
module.exports = {
  getAllFiles: getAllFiles, //READ
  searchFile: searchFile,   //READ
  deleteFile: deleteFile    //DELETE
};