var Cookies = require('cookies'),
Keygrip = require('keygrip'),
Cryptr = require('cryptr')

//Cryptr: for encrypting cookies which are susceptible to snooping
var cryptrObj = new Cryptr('7dasihfuhoa8ih34h09xr3408h')//the key is random

//returns a cookies object using cookies api signed with keygrip api
function getCookiesObj(req,res){
	var keys = Keygrip(["du283ikf84ygdjw","18396o7fhsgsujwn5i","101i3n3nbzxqwm"]),//these are random
	cookies = new Cookies( req, res, { "keys": keys } )
	return cookies
}

var getLoginCookies = function(req, res){
	var cookies = getCookiesObj(req, res),
	user = cookies.get("uId", { signed: true} ),
	credentials = cookies.get("uAuth", { signed: true} )
	if(user && credentials){
		user = cryptrObj.decrypt(user)
    credentials = cryptrObj.decrypt(credentials)
	}
	console.log("getLoginCookies called: uId:", user, ", uAuth:", credentials)
	return {"uId": user, "uAuth": credentials}
}

//should save user name/ cipher text password as server-side cookies
function setLoginCookies(req,res, uname, uct_pw){
	console.log("setting cookies: uId:", uname, ", ct_pw:", uct_pw)
  var cookies = getCookiesObj( req, res)
	if(uname && uct_pw){
		uname = cryptrObj.encrypt(uname)
		uct_pw = cryptrObj.encrypt(uct_pw)
		var expires = 86400000 * 7 //expires in 7 days
	  cookies
			.set("uId", uname, { signed: true, httpOnly: true, overwrite: true, maxAge: expires } )
		  .set("uAuth", uct_pw, { signed: true, httpOnly: true, overwrite: true, maxAge: expires } )
	}else{
		console.log("name or password undefined. cannot set")
	}
}

exports.setLoginCookies = setLoginCookies
exports.getLoginCookies = getLoginCookies
