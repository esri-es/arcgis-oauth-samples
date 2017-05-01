/*jshint esversion: 6 */
const arcgis = require('../common');

/*********************
  it get the user items
**********************/

module.exports = function(req, res){
  const c = req.session.credentials;
  let u = (c)? c.username : 'hhkaos2';

  if(req.params.username){
      u = req.params.username;
  }

  const options = {
    url: 'https://www.arcgis.com/sharing/rest/content/users/' + u,
    params: req.query,
    req: req
  };

  if(c){
    options.params.token = c.access_token;
  }

  arcgis.get(options).then( (conent) => {
    res.send(conent);
  });
};
