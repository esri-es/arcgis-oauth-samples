/*jshint esversion: 6 */
const arcgis = require('../common');

/*********************

**********************/

module.exports = function(req, res){
  const c = req.session.credentials;
  req.query.url = req.query.url.replace("http:", "https:");
  console.log("req.query.url=",req.query.url)

  const options = {
    url: req.query.url,
    params: req.query,
    req: req
  };

  if(c){
    options.params.token = c.access_token;
  }

  arcgis.get(options).then( (fs) => {
    res.send(fs);
  });
};;
