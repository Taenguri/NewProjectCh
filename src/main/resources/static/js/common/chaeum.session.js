function getSessionMaxTime() {
    return document.getElementById("session_max_time").value;
}

let session_max_time = "";
let session_timer = "";

document.addEventListener('DOMContentLoaded', function () {
	session_max_time = getSessionMaxTime();
	session_timer = setInterval(checkTime, 1000);
	document.getElementById('logout_btn').addEventListener('click', logoutAfterAction);
});

/*function logoutAction(){
	commonAjax(getContextPath() + "/logout", "GET", null, true, logoutAfterAction);
}*/

function logoutAfterAction() {
	alert("로그아웃 되었습니다.");
	location.href = getContextPath()+'/logout';
}

function checkTime() {
	let session_minute;
	let session_second;

	if(session_max_time % 60 === 0) {
		session_minute = session_max_time / 60;
		session_second = "0"+0;
	} else {
		session_minute = session_max_time / 60;
		session_second = session_max_time % 60;
	}
	
	document.getElementById("session_minute").innerText = Math.floor(session_minute);
	if(session_second.toString().length <= 1){
		document.getElementById("session_second").innerText = "0" + session_second;
	} else {
		document.getElementById("session_second").innerText = session_second;
	}
	
	
	session_max_time--;
	
	if(session_max_time === 1) {
		logoutAfterAction();
	}
}

function sessionExtension() {
	commonAjax(getContextPath() + "/set/session/time", "POST", null, true,sessionExtensionAfterAction,false);
}

function sessionExtensionAfterAction(response) {
	session_max_time = response.SESSION_TIME_OUT;
	clearInterval(session_timer);
	session_timer = setInterval(checkTime, 1000);
	
	//sessionCheck();
}

/*
function sessionCheck() {
	commonAjax(getContextPath() + "/check/session", "GET", null, true, function (response) {},false);
}*/
