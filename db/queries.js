//Loads pg-promise as a dependency for the script.
//Allows us to access our database via HTTP Requests.
let pgp = require('pg-promise')();
let connString = process.env.DATABASE_URL;
let db = pgp(connString);
var fs = require('fs');

function getDestination (req, file, cb) {
  cb(null, '/../public/files')
}

function MyCustomStorage (opts) {
  this.getDestination = (opts.destination || getDestination)
}

MyCustomStorage.prototype._handleFile = function _handleFile (req, file, cb) {
  this.getDestination(req, file, function (err, path) {
    if (err) return cb(err)

    var outStream = fs.createWriteStream(path)

    file.stream.pipe(outStream)
    outStream.on('error', cb)
    outStream.on('finish', function () {
      cb(null, {
        path: path,
        size: outStream.bytesWritten
      })
    })
  })
}

MyCustomStorage.prototype._removeFile = function _removeFile (req, file, cb) {
  fs.unlink(file.path, cb)
}

module.exports = function (opts) {
  return new MyCustomStorage(opts)
}

//Whenever the index is loaded, calls this.
//Grabs the entire filelist, then orders said filelist by timestamp and id, descending.
//The idea is to have the most recent files at the top of the table.
function getAllFiles(req, res, next) {
  db.any('SELECT * FROM filelist ORDER BY uploaded DESC')
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
function getOneCast(req, res, next) {
  let cast_id = parseInt(req.params.id);
  db.one('DROP VIEW IF EXISTS compiled; CREATE VIEW compiled AS SELECT * FROM castmember, factionList, seriesEra, serieslist, mobileweapon, manufacturer, voiceactor WHERE (factionList.faction_id = castmember.faction) AND (mobileweapon.mobileweapon_id = castmember.mobile_weapon) AND (manufacturer.manufacturer_id = mobileweapon.manufacturer) AND (voiceactor.voice_id = castmember.voice_actor) AND (serieslist.series_id = castmember.appears_in) AND (seriesEra.era_id = serieslist.series_era) ORDER BY cast_id ASC; SELECT cast_name, faction_name, model, english_voice, japanese_voice, era_name from compiled WHERE cast_id = $1', cast_id)
    .then(function(data) {
      res.status(200)
      console.log(data)
      res.render('result', {title:"Gundam API", datasolo:data, data: false});
    })
    .catch(function(err) {
      return next(err);
    });
}

//Adds a new row to the table based on user specifications.
//Takes six inputs, since IDs are automatically generated.
//Satisfies C of CRUD.
function createCast(req, res, next) {
  req.body.age = parseInt(req.body.age);
  console.log('req.body ===>', req.body)
  db.none('insert into castmember(cast_name, faction, mobile_weapon, voice_actor, appears_in)' +
      'values(${cast_name}, ${faction}, ${mobile_weapon}, ${voice_actor}, ${appears_in})',
      req.body)
    .then(function() {
      res.status(200)
        .json({
          status: 'success',
          message: 'One Character Inserted'
        });
    })
    .catch(function(err) {
      return next(err);
    });
}

//Deletes the row at the target ID. Simple enough.
//Satisfies D of CRUD.
function deleteCast(req, res, next) {
  let castID = parseInt(req.params.id);
  db.result('delete from castmember where cast_id = $1', castID)
    .then(function(result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed character at ${result.rowCount}`
        });
    })
    .catch(function(err) {
      return next(err);
    });
}


//CRUD
module.exports = {
  createCast: createCast, //CREATE
  getAllFiles: getAllFiles, //READ
  getOneCast: getOneCast,   //READ
  deleteCast: deleteCast,    //DELETE
};