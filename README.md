# ArcGIS oAuth samples
Backend and frontend code samples


## Server side
Read the [full documentation here](https://developers.arcgis.com/authentication/server-based-user-logins/#request-parameters).

Code samples:

* [PHP](php/)

### Get code URL

* URL: https://www.arcgis.com/sharing/rest/oauth2/authorize
* Params:
  * client_id => YOUR_CLIENT_ID
  * redirect_uri => STEP 2 URI
  * response_type => code
  * expiration => -1

**Response**: it redirects you to the URL you specified with a "code" param
in the URL.

### Get token & refresh_token
* URL: https://www.arcgis.com/sharing/rest/oauth2/token
* Params:
  * client_id => YOUR_CLIENT_ID
  * client_secret => YOUR_CLIENT_SECRET
  * grant_type => authorization_code
  * code => CODE_PARAM_FROM_URL
  * redirect_uri => FINAL STEP URI

**Response**: a JSON object with:

* access_token => a valid token
* expires_in => when the access_token expires
* username => account owner username
* refresh_token => non-expiring token that will enable you to get future tokens

### Using refresh_token
* URL: https://www.arcgis.com/sharing/rest/oauth2/token/
* Params:
  * client_id => YOUR_CLIENT_ID
  * refresh_token => YOUR_REFRESH_TOKEN
  * grant_type => refresh_token

**Response**: a JSON object with:

* access_token => a valid token
* expires_in => when the access_token expires
* username => account owner username

# Documentation

* [ArcGIS Security and Authentication](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/)
* [Demystifying oAuth and ArcGIS](http://blog.davebouwman.com/2017/08/27/authentication-with-arcgis/)
