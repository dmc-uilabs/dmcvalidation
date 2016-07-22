var appRouter = function(app) {
var proxy = httpProxy.createProxyServer();

app.post("/", function(req, res) {

  var fs = require('fs'),
      request = require('request');

  var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
      console.log(req.body);
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

  download(req.body.url, 'File', function(){
    console.log('done');


 var cmd=require('node-cmd');
  cmd.get(
          'ls',
          //'clamscan File',
          function(data){
              console.log('the current working dir is : ',data);

              //Default set to true
              var verified = true;

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
                      "scanLog":data.substring(0, (data.indexOf(":")+4))
                    }

                    console.log(validated);

var needle = require('needle');
var options = {
  headers: { "Content-Type": "application/json","AJP_eppn": "fforgeadmin" }
}

//Call back to the REST server
needle.post('http://localhost:8080/verify/', JSON.stringify(validated), options, function(err, resp) {
  // you can pass params as a string or as an object.
  console.log("guess whose back ");
});

          }
      );
  });

res.send('hello world');
});

}
module.exports = appRouter;
