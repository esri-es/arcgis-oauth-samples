/*jshint esversion: 6 */

const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const config = require('../config.json');
const arcgisLogin = require('./login');
const app = express();

app.use(session({
    store: new FileStore,
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  })
);

app.set('view engine', 'ejs');

app.get('/', function (req, res) {

  if(!req.session.credentials){
    if(req.query.code){
      arcgisLogin.getRefreshToken(req).then((r) => {
        console.log("r=",r);

        if(r.error && r.error.code === 400){
          res.render('index.ejs', {
            url: arcgisLogin.getCodeUrl(req),
            error: r.error.error_description
          });
        }else{
          req.session.credentials = r;
          res.render('account.ejs', { req : req });
        }
      });
    }else{

      res.render('index.ejs', {
        url: arcgisLogin.getCodeUrl(req)
      });
    }
  }else{
    res.render('account.ejs', { req : req });
  }

});

app.get('/logout', function (req, res) {
  delete req.session.credentials;
  res.redirect('/');
});

/*
  Defining ArcGIS API
*/
const api = {
  users: require('./api/users'),
  content: require('./api/content'),
  featureService: require('./api/featureService')
};


app.route('/api/community/users/:username')
    .get(api.users);
    //.post(api.users);

app.route('/api/content/users/:username')
    .get(api.content);

app.route('/api/content/users/:username/featureService')
    .get(api.featureService);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
