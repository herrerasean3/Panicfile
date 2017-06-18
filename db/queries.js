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

//Parses the integer from the URL parameter.
//Then it SELECTs everything in the database with the parsed ID.
//Barring any errors with duplicate IDs, will always return exactly one result.
//Satisfies R in CRUD.
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



//Deletes the row at the target ID. Simple enough.
//Satisfies D of CRUD.
function deleteFile(req, res, next) {
  let fileID = parseInt(req.query.fileid);
  fs.unlinkSync(`public/files/${req.query.renamed}`, db.result(`DELETE FROM filelist WHERE file_id = ${fileID}`)
    .then(function(result) {
      getAllFiles();
    })
    .catch(function(err) {
      getAllFiles();
    }))
}

//CRUD
module.exports = {
  getAllFiles: getAllFiles, //READ
  searchFile: searchFile,   //READ
  deleteFile: deleteFile    //DELETE
};