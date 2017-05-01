/*jshint esversion: 6 */

const querystring = require('querystring');
const config = require('../config.json');
const https = require('https');
const defer = require('node-promise').defer;


var getFullUrl = (req) => {
  return req.protocol + '://' + req.get('host') + req.path;
  //req.originalUrl; <- include query params
};

var getCodeUrl = (req) => {
  let fullUrl = getFullUrl(req);

  let params = {
      'client_id': config.client_id,
      'redirect_uri': fullUrl,
      'response_type': 'code',
      'expiration': -1
  };

  let p = querystring.stringify(params);

  return 'https://www.arcgis.com/sharing/rest/oauth2/authorize?' + p;
};


var getRefreshToken = (req) => {
  const deferred = defer();

  const post_data = querystring.stringify({
      'client_id': config.client_id,
      'client_secret': config.client_secret,
      'grant_type': 'authorization_code',
      'code': req.query.code,
      'redirect_uri': getFullUrl(req)
  });

  const post_options = {
    hostname: 'www.arcgis.com',
    port: 443,
    path: '/sharing/rest/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    }
  };

  // Set up the request
  var post_req = https.request(post_options, function(res) {
      res.setEncoding('utf8');
      /*res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });*/
      var body = '';

      res.on('data', function (chunk) {
        body += chunk;
      });

      res.on('end', function () {
        try{
          body = JSON.parse(body);
          console.log('BODY: ', body);
          //req.session.views
          deferred.resolve(body);
          
        }catch(e){
          deferred.reject("Error: "+ e);
        }
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();

  return deferred;
};

module.exports = {
  "getCodeUrl": getCodeUrl,
  "getRefreshToken": getRefreshToken
};
