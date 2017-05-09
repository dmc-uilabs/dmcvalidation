var appRouter = function(app) {
var proxy = httpProxy.createProxyServer();

app.get('/', function (req, res) {
  res.send('validation online')
})

app.post("/", function(req, res) {

  var fs = require('fs'),
      request = require('request');

  var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);

      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

  console.log("request",req);

  download(req.body.url, 'File', function(){
    console.log('done');



  //Sha256 Calculation

  var crypto = require('crypto');
  var fs = require('fs');
  var algo='sha256';
  var shasum =crypto.createHash(algo);
  var sha ='';
  var file = 'File';
  var s = fs.ReadStream(file);
  s.on('data', function(sha) { shasum.update(sha); });
  s.on('end', function() {
    sha = shasum.digest('hex');
    console.log(sha);
  });




 var cmd=require('node-cmd');
  cmd.get(

          'clamscan File',


          function(data){

              var d = new Date();
              var milliSeconds = d.getTime();

              console.log('the current working dir is : ',data);

              //Default set to false
              var verified = false;
              var scanResult = data.substring(0, (data.indexOf(":")+4))

              if(scanResult =='File: OK')
                verified = true;


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
                      "scanLog":scanResult,
		                  "restIP":req.body.restIP,
                      "sha256":sha,
                      "scanDate":milliSeconds
                    }

                    console.log(validated);

var needle = require('needle');
var options = {
  headers: { "Content-Type": "application/json","AJP_eppn": req.body.userEPPN }
}

// Call back to the REST server
needle.post("http:/\/"+validated.restIP+':8080/rest/verify/', JSON.stringify(validated), options, function(err, resp) {
  // you can pass params as a string or as an object.
  console.log("guess whose back ");

});

          }
      );
  });

res.send('validation reached');
});

}
module.exports = appRouter;
