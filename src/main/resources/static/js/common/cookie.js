// 쿠키 저장 함수 
function setCookie(cookieName, cookieValue, expireDays){
	let value = cookieValue;
	if("" !== expireDays){
		let expireDate = new Date();
		expireDate.setDate(expireDate.getDate() + expireDays); // 넘겨 온 일자 값
		value += "; path=/; expires = " + expireDate.toGMTString();
	}/*
	value += "; crossCookie=bar; SameSite=None; Secure";*/
	document.cookie = cookieName + "=" + value ;
}
	
// 특정 쿠키 이름의 따른 값을 읽어오는 함수
function getCookie(cookieName){
	let cookies = document.cookie.split("; ");
	let cookieNameValue = "";
	if(cookies.length <= 0){
		return cookieNameValue;
	}
	for(let i = 0; i < cookies.length; i++){
		if(cookieName === cookies[i].split("=")[0]){
			cookieNameValue = cookies[i].split("=")[1];	
		}
	}
	return cookieNameValue; // 기본값
}

function deleteCookie(cookieName){
	let temp=getCookie(cookieName);
	if(temp){
		setCookie(cookieName,temp,-1);
	}
}