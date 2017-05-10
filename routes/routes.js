var appRouter = function(app) {
  var proxy = httpProxy.createProxyServer();

  app.get('/', function(req, res) {
    res.send('validation online')
  })

  app.post("/", function(req, res) {

    fs = require('fs'),
      request = require('request');

    console.log('reached post')

    function getDocument(uri, filename, callback) {


      console.log("got url ", uri)
      var credentials = {

        accessKeyId: process.env['VAL_S3_KEY'],
        secretAccessKey: process.env['VAL_S3_SECRET'],
        region: 'us-east-1'
      };


      var AWS = require('aws-sdk')
      var s3 = new AWS.S3(credentials)


      var params = {
        Bucket: "dmcuptemp",
        Key: uri.substring(uri.indexOf("m/") + 2)
      };
      console.log(uri)
      console.log(params);
      var file = require('fs').createWriteStream(filename);

      s3.getObject(params).on('httpData', function(chunk) {
        file.write(chunk);
      }).on('httpDone', function() {

        file.end();
        console.log("got all the file");

        callback(filename);
      }).send();

    }

    getDocument(req.body.url, "file", afterDownload);



    function afterDownload(filename) {
      console.log("inside the after the dowload ");

      var cmd = require('node-cmd');
      cmd.get('clamscan file', function(data) {
        console.log('the current working dir is : ', data);

        //Default set to false
        var verified = false;
        var scanResult = data.substring(0, (data.indexOf(":") + 4))
        // the scan results are true
        if (scanResult == (filename + ': OK')) {
          verified = true;

          // calculate the sha
          var crypto = require('crypto');
          var fs = require('fs');
          var algo = 'sha256';
          var shasum = crypto.createHash(algo);
          var sha = '';
          fs.ReadStream(filename).on('data', function(sha) {
            shasum.update(sha);
          }).on('end', function() {
            sha = shasum.digest('hex');
            console.log(sha);




            //Return object
            var validated = {
              "id": req.body.id,
              "url": req.body.url,
              "table": req.body.table,
              "folder": req.body.folder,
              "resourceType": req.body.resourceType,
              "userEPPN": req.body.userEPPN,
              "urlColumn": req.body.urlColumn,
              "idColumn": req.body.idColumn,
              "verified": verified,
              "scanLog": scanResult,
              "restIP": req.body.restIP,
              "sha256": sha
            }

            console.log(validated);

            var needle = require('needle');
            var options = {
              headers: {
                "Content-Type": "application/json",
                "AJP_eppn": req.body.userEPPN
              }
            }

            //Call back to the REST server
            needle.post("http:/\/" + validated.restIP + ':8080/rest/verify/', JSON.stringify(validated), options, function(err, resp) {
              // you can pass params as a string or as an object.
              console.log("guess whose back ");

            });





          });

        } else {
          // move to quarantine folder
          console.log("moving to quarantine")
          var validated = {
            "id": req.body.id,
            "url": req.body.url,
            "table": req.body.table,
            "folder": req.body.folder,
            "resourceType": req.body.resourceType,
            "userEPPN": req.body.userEPPN,
            "urlColumn": req.body.urlColumn,
            "idColumn": req.body.idColumn,
            "verified": false,
            "scanLog": scanResult,
            "restIP": req.body.restIP,
            "sha256": "failed validation"
          }

          console.log(validated);

          var needle = require('needle');
          var options = {
            headers: {
              "Content-Type": "application/json",
              "AJP_eppn": req.body.userEPPN
            }
          }

          //Call back to the REST server
          needle.post("http:/\/" + validated.restIP + ':8080/rest/verify/', JSON.stringify(validated), options, function(err, resp) {
            // you can pass params as a string or as an object.
            console.log("guess whose back ");

          });
        }

      });
    }

    res.send('validation reached');
  });

}
module.exports = appRouter;
