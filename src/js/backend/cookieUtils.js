//returns a cookies object using cookies api encrypted with keygrip api
function getCookiesObj(req,res){
	var keys = Keygrip(["du283ikf84ygdjw","18396o7fhsgsujwn5i","101i3n3nbzxqwm"]),//these are random
	cookies = new Cookies( req, res, { "keys": keys } )
	return cookies
}

var getLoginCookies = function(){
	var cookies = getCookiesObj(req, res),
	user = cookies.get("uId", { signed: true, httpOnly: true } ),
	credentials = cookies.get("uAuth", { signed: true, httpOnly: true } )
	return {"uId": user, "uAuth": credentials}
}

//should save user name/ cipher text password as server-side cookies
function setLoginCookies(req,res, uname, uct_pw){
	console.log("setting cookies", uname, uct_pw)
  var cookies = getCookiesObj( req, res)
	if(uname && uct_pw){
	  cookies
			.set("uId", uname, { signed: true, httpOnly: true } )
		  .set("uAuth", uct_pw, { signed: true, httpOnly: true } )
	}else{
		console.log("name or password undefined. cannot set")
	}
}

exports.setLoginCookies = setLoginCookies
exports.getCookiesObj = getCookiesObj
