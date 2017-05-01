/*jshint esversion: 6 */
const defer = require('node-promise').defer;
const https = require('https');
const querystring = require('querystring');
const config = require('../config.json');
const StringDecoder = require('string_decoder').StringDecoder;

/*********************
  _post: send a HTTP post request and if token has expired
  it gets a new token a re-send the request
**********************/
const _post = (post) => {
  const deferred = defer();

  var post_req = https.request(post.options, function(res) {
      res.setEncoding('utf8');
      var body = '';

      res.on('data', function (chunk) {
        body += chunk;
      });

      res.on('end', function () {

        try{
          obj = JSON.parse(body);

          if(obj.error && (obj.error.code == 498 || obj.error.code == 499)){

            console.log("The token has expired");
            _refreshToken(options.req).then( (token) => {
              post.data.token = token;
              _post(options).then( (output) => {
                deferred.resolve(output);
              });
            });

          }else{
            deferred.resolve(obj);
          }
        }catch(e){
          deferred.reject(e.message);
        }
      });
  }).on('error', function(e) {
    deferred.reject(e.message);
  });

  post_req.write(post.data);
  post_req.end();

  return deferred;
};

/*********************
  _get: send a HTTP GET request and if token has expired
  it gets a new token a re-send the request
**********************/
const _get = (options) => {
  const deferred = defer();

  let p = querystring.stringify(options.params);
  let url = options.url + '?' + p;

  req = https.get(url, function(res) {
    let obj = '';

    res.on('data', function(chunk) {
      res.setEncoding('utf8');
      decoder = new StringDecoder('utf8');
      textChunk = decoder.write(chunk);
      obj += textChunk;
    });

    res.on('end', function(chunk) {
      try{
        obj = JSON.parse(obj);

        if(obj.error && (obj.error.code == 498 || obj.error.code == 499)){

          console.log("The token has expired");
          _refreshToken(options.req).then( (token) => {
            options.params.token = token;
            _get(options).then( (output) => {
              console.log("Lanzamos nuevo get");
              deferred.resolve(output);
            });
          });

        }else{
          deferred.resolve(obj);
        }
      }catch(e){
        deferred.reject(e.message);
      }
    });
  }).on('error', function(e) {
    deferred.reject(e.message);
  });

  req.end();

  return deferred;
};

/*********************
  _refreshToken: use the refresh_token param to get a
  new access token, overwrite the access_token property
  inside the session and return the new token
**********************/
const _refreshToken = (req) => {
  const deferred = defer();

  const post_data = querystring.stringify({
      'client_id': config.client_id,
      'refresh_token': req.session.credentials.refresh_token,
      'grant_type': 'refresh_token'
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

  _post({
    data: post_data,
    options: post_options
  }).then((r) =>{
      req.session.credentials.access_token = r.access_token;
      deferred.resolve(r.access_token)
  });

  return deferred;
};

module.exports = {
  post: _post,
  get: _get
};
