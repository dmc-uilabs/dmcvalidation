var appRouter = function(app) {
var proxy = httpProxy.createProxyServer();

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

  download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
    console.log('done');


 var cmd=require('node-cmd');
  cmd.get(
          'clamscan google.png',
          function(data){
              console.log('the current working dir is : ',data)


              var validated={
                "name": "testtag555",
                "projectId": "6"
              }


              // var validated = {
              //        "id": req.body.id,
              //        "url": req.body.url,
              //        "table": req.body.table,
              //        "folder": "Profile",
              //        "resourceType": "ProfilePicture",
              //        "userEPPN": req.body.userEPPN,
              //        "verified": "garbage",
              //        "scanLog":data.substring(0, (data.indexOf(":")+4))
              //      }

                          // proxy.web(req, res.send(validated), {
                          //   target: 'http://localhost:8080/projects_tags/'
                          // });
var needle = require('needle');
var options = {
  headers: { "Content-Type": "application/json","AJP_eppn": "fforgeadmin" }
}

needle.post('http://localhost:8080/projects_tags/', JSON.stringify(validated), options, function(err, resp) {
  // you can pass params as a string or as an object.
  console.log("guess whose back ");
  console.log(resp.body)
});


          }
      );




  });

res.send('hello world');
});



}

module.exports = appRouter;
