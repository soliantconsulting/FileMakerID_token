// install node-fetch version 2 otherwise the next line with throw an error
// npm install node-fetch@2
global.fetch = require('node-fetch');
var express = require('express');
var router = express.Router();
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { check, validationResult } = require('express-validator');
const http = require('https');
var config = require('../config');

var poolId;
var clientId;
var poolData;

/* POST to get user's tokens. */
router.post('/', [
   check('password').isLength({ min: 3 }),
   check('username').isEmail()
 ] , async function(req, res) {
  
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
     return res.status(422).json({ errors: errors.array() })
   };

  const user = req.body.username;
  const pw = req.body.password;

 
  var authenticationData = {
    Username : user,
    Password : pw,
  };
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  try {
   poolData = await makeSynchronousPoolRequest();
  }
  catch(e) {
   return res.status(422).json({ errors: e })
  }
  if (poolData == undefined) {
      return res.status(422).json({ errors: "could not get pool data from Cognito" })
   };
  //var poolData = { UserPoolId : 'us-west-2_BSWyhtF3m', ClientId : '5lgnck0inl7ujcaoqdi729oamp'};
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  var userData = {
      Username : user,
      Pool : userPool
  };

  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  var error = '';

  cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (session) {
         console.log("success");
         //console.log(session);

         const callbackTokens = {
            accessToken: session.getAccessToken().getJwtToken(),
            // idToken: session.getIdToken().getJwtToken(),
            idToken: session.idToken.jwtToken,
            //refreshToken: session.getRefreshToken().getToken()
            refreshToken: session.refreshToken.token
          };
          response = {
            user:user,
            tokens:callbackTokens,
            error:error
         };
         res.send(response);
      },
      onFailure: function(err) {
         console.log(err);
         error = err;
         response = {
            user:user,
            tokens:'',
            error:error
         };
         res.send(response);
      },
      mfaRequired: function(codeDeliveryDetails) {
         console.log('MFA required');
         error = 'MFA required';
         response = {
            user:user,
            tokens:'',
            error:error
         };
         res.send(response);
     }
    });
});

/* POST to get a new token based on the refresh token. */
router.post('/refresh',[
      check('refresh_token').isLength({ min: 20 }),
      check('username').isEmail()
   ], async function(req, res) {

   const errors = validationResult(req)
   if (!errors.isEmpty()) {
     return res.status(422).json({ errors: errors.array() })
   }
 
   const token  = req.body.refresh_token
   const user = req.body.username

   try {
      poolData = await makeSynchronousPoolRequest();
     }
     catch(e) {
      return res.status(422).json({ errors: e })
     }
     if (poolData == undefined) {
         return res.status(422).json({ errors: "could not get pool data from Cognito"
      })
   };

   var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
   var userData = {
       Username : user,
       Pool : userPool
   };
 
   var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

   var cognitoToken = new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken: token });
   cognitoUser.refreshSession(cognitoToken, function (err, session) {
      console.log(err, session);
      if (err) {
         return res.status(422).json({ errors: "could not get new id_token from Cognito"});
      }
      var idToken = session.getIdToken().getJwtToken();
      response = {
         user:user,
         id_token:idToken
      };
      res.send(response);
   })
 })

function getPoolPromise() {
	return new Promise((resolve, reject) => {
      var ets = config.ets;
      var url;
      if(ets == true){
         url = config.pool_url_ets;
      }
      else{
         url = config.pool_url;
      }
		http.get(url, (response) => {
			let chunks_of_data = [];

			response.on('data', (fragments) => {
				chunks_of_data.push(fragments);
			});

			response.on('end', () => {
				let response_body = Buffer.concat(chunks_of_data);
				resolve(response_body.toString());
			});

			response.on('error', (error) => {
				reject(error);
			});
		});
	});
}

// async function which will wait for the HTTP request to be finished
async function makeSynchronousPoolRequest(request) {
	try {
		let http_promise = getPoolPromise();
		let response_body = await http_promise;

		// holds response from server that is passed when Promise is resolved
      console.log(response_body);
      var body = JSON.parse(response_body);
      poolId = body.data.UserPool_ID;
      clientId = body.data.Client_ID;
      var poolData = { 
      UserPoolId : poolId,
      ClientId : clientId
      };
      return poolData;
	}
	catch(error) {
		// Promise rejected
      console.log(error);
      return undefined;
      
	}
}


module.exports = router;
