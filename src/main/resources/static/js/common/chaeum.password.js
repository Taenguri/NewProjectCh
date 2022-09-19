function CSPassword(pwId, showTextId, pwConfirmId, confimShowTextId, prevPwId, prevShowTextId) { 
    this.password = document.getElementById(pwId);
    this.passwordConfirm = document.getElementById(pwConfirmId);
	this.showText = document.getElementById(showTextId);
	this.confirmShowText = document.getElementById(confimShowTextId);
	this.prevPassword = document.getElementById(prevPwId);
	this.prevShowText = document.getElementById(prevShowTextId);
	this.prevStatus = false;
    this.status = false;
    this.confirmStatus = false;
    this.MAX_LEN = 20;
    this.MSG = "비밀번호는 영문,숫자 1자 이상, 특수문자 1자 이상 조합하여 8자리 이상 20자리 이하로 입력해 주십시오.";
}


CSPassword.prototype.expressionKeyDown = function() {
    let passwordValue = "";
    let engNumSpeExp  = /^.*(?=.{8,15})(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@\#$%<>^&*\()\-=+\',.`";:<>/?\[\]\-\\+_=|\\]).*$/; // 영문, 숫자, 특수문자
    let engNumExp     = /^.*(?=.{10,15})(?=.*[0-9])(?=.*[a-zA-Z]).*$/; // 숫자, 영문
    let speEngExp     = /^.*(?=.{10,15})(?=.*[!@\#$%<>^&*\()\-=+\',.`";:<>/?\[\]\-\\+_=|\\])(?=.*[a-zA-Z]).*$/; // 특수문자, 영문
    let speNumExp     = /^.*(?=.{10,15})(?=.*[0-9])(?=.*[!@\#$%<>^&*\()\-=+\',.`";:<>/?\[\]\-\\+_=|\\]).*$/; // 특수문자, 숫자

	let showTextID = this.showText;
	let passwordID = this.password;
	let passwordConfirmID = this.passwordConfirm;
	let chackMSG = this.MSG;
	var labelText = getLabelText(passwordID.getAttribute("id"));
	
    this.password.setAttribute("maxlength", this.MAX_LEN);
    this.password.addEventListener("keyup", function(e) {
        passwordValue = this.value;
        if ( passwordValue ) {
			var hasAll = engNumSpeExp.test(passwordValue);
            let hasTwo = engNumExp.test(passwordValue) || speEngExp.test(passwordValue) || speNumExp.test(passwordValue);
			if ( hasAll ) {
				showTextID.style.color = "#0000FF";
				showTextID.innerHTML  = "양호";
				this.status = true;
			} else {
				if ( hasTwo ) {
					showTextID.style.color = "#0000FF";
					showTextID.innerHTML  = "보통";
					this.status = true;
				} else {
					showTextID.style.color = "#FF0000";
					showTextID.innerHTML  = chackMSG;
					this.status = false;
				}
			}
        } else {
        	showTextID.style.color = "#FF0000";
        	showTextID.innerHTML  = labelText + "를 입력해주세요.";
            this.status = false;
        }
    });
}

/**
 * 비밀번호 규칙이 올바른지를 리턴한다.
 *
 * @return true/false
 */
CSPassword.prototype.isValid = function() {
    if (!this.status) {
        alert(getLabelText(this.password.getAttribute("id")) + "는 " + this.MSG);
        this.password.focus();
    }
    return this.status;
}

/**
 * 비밀번호와 비밀번호확인을 blur, keyup 이벤트를 통해 같은지 여부를 체크한다.
 */
CSPassword.prototype.passwordConfirmBlur = function() {
	let passwordID = this.password;
	let passwordConfirmID = this.passwordConfirm;
	let prevPasswordID = this.prevPassword;
	let confirmShowTextID = this.confirmShowText;
	
    this.passwordConfirm.setAttribute("maxlength", this.MAX_LEN);

	var labelText = getLabelText(passwordConfirmID.getAttribute("id"));
	
    let passwordCheckEvent = function () {
		if(!isNull(prevPasswordID) && passwordID.value === prevPasswordID.value){
			confirmShowTextID.style.color = "#FF0000";
			confirmShowTextID.innerHTML  = "현재 비밀번호와 동일";
			prevStatus = false;
			confirmStatus = true;
		} else if (passwordConfirmID.value.length > 0) {
			if (passwordID.value == passwordConfirmID.value) {
				confirmShowTextID.style.color = "#0000FF";
				confirmShowTextID.innerHTML  = "일치";
				prevStatus = true;
				confirmStatus = true;
			} else {
				confirmShowTextID.style.color = "#FF0000";
				confirmShowTextID.innerHTML  = "비밀번호가 일치하지 않습니다.";
				prevStatus = true;
				confirmStatus = false;
			}
		} else {
			confirmShowTextID.style.color = "#FF0000";
			confirmShowTextID.innerHTML  = labelText + "을 입력해주세요.";
			prevStatus = true;
			confirmStatus = false;
		}
    };
    this.password.addEventListener("blur", passwordCheckEvent);
    this.password.addEventListener("keyup", passwordCheckEvent);
    this.passwordConfirm.addEventListener("blur", passwordCheckEvent);
    this.passwordConfirm.addEventListener("keyup", passwordCheckEvent);
}

/**
 * 비밀번호와 비밀번호확인을 확인버튼을 통해 같은지 여부를 체크한다.
 */
CSPassword.prototype.passwordConfirmClick = function() {
    this.passwordConfirm.setAttribute("maxlength", this.MAX_LEN);
    if (this.passwordConfirm.value) {
        this.confirmStatus = this.password.value === this.passwordConfirm.value;
    } else {
        this.confirmStatus = false;
    }
    return this.confirmStatus;
}

/**
 * 정규식을 통하여 비밀번호 규칙을 검사한다.
 */
CSPassword.prototype.expressionClick = function() {
    let passwordValue = this.password.value;
    let engNumSpeExp  = /^.*(?=.{8,15})(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@\#$%<>^&*\()\-=+\',.`";:<>/?\[\]\-\\+_=|\\]).*$/; // 영문, 숫자, 특수문자
    let engNumExp     = /^.*(?=.{10,15})(?=.*[0-9])(?=.*[a-zA-Z]).*$/; // 숫자, 영문
    let speEngExp     = /^.*(?=.{10,15})(?=.*[!@\#$%<>^&*\()\-=+\',.`";:<>/?\[\]\-\\+_=|\\])(?=.*[a-zA-Z]).*$/; // 특수문자, 영문
    let speNumExp     = /^.*(?=.{10,15})(?=.*[0-9])(?=.*[!@\#$%<>^&*\()\-=+\',.`";:<>/?\[\]\-\\+_=|\\]).*$/; // 특수문자, 숫자

    this.password.setAttribute("maxlength", this.MAX_LEN);
    if (!isNull(passwordValue)) {
        let hasTwo = engNumExp.test(passwordValue) || speEngExp.test(passwordValue) || speNumExp.test(passwordValue);
        if ( engNumSpeExp.test(passwordValue) ) this.status = true;
        else this.status = hasTwo;
    } else {
        this.status = false;
    }
}

/**
 * 비밀번호와 비밀번호확인이 일치하는지 여부를 리턴한다.
 */
CSPassword.prototype.equals = function() {
    if (!this.confirmStatus) {
        alert(getLabelText(this.password.getAttribute("id")) + "가 일치하지 않습니다.");
        this.passwordConfirm.focus();
    }
    return this.confirmStatus;
}

/**
 * 비밀번호 입력박스 초기화를 수행한다.
 */
CSPassword.prototype.initPassword = function() {
    this.password.value = "";
    this.passwordConfirm.value = "";
	this.showText.innerHTML = "";
	this.confirmShowText.innerHTML = "";	
	this.prevPassword.value = "";
	this.status = false;
	this.confirmStatus = false;	
	this.prevStatus = false;
}

CSPassword.prototype.chkPasswd = function() {
	let pw1 = this.password.value;
	let pw2 = this.passwordConfirm.value;
    if (pw1 != pw2) {
    	alert("비밀번호의 길이는 8~20까지 입니다.");
    	this.password.focus();
		return false;
    }
    if (pw1.length < 8 || pw1.length > 20) {
    	alert("비밀번호의 길이는 8~20까지 입니다.");
    	this.password.focus();
		return false;
	}
    var isalpha = 0;
    var isnumber = 0;
    for (var i = 0; i < pw1.length; i++) {
        var chr = pw1.substr(i, 1);
        if ((chr >= 'a' && chr <= 'z') || (chr >= 'A' && chr <= 'Z')) {
            isalpha += 1;
        } else {
            isnumber += 1;
        }
    }
    var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var number = "1234567890";
    var sChar = "-_=+\|(){}[]*&^%$#@!~`?></;,.:'";
    var sChar_Count = 0;
    var alphaCheck = false;
    var numberCheck = false;
    var len = pw1.length;
    var sCh = '';
    var cnt = 0;
    for (var t = 0; t < len; t++) {
        if (sChar.indexOf(pw1.charAt(t)) != -1) {
            sChar_Count++;
        }
        if (alpha.indexOf(pw1.charAt(t)) != -1) {
            alphaCheck = true;
        }
        if (number.indexOf(pw1.charAt(t)) != -1) {
            numberCheck = true;
        }
    }
    if (sChar_Count < 1 || alphaCheck != true || numberCheck != true) {
    	alert("비밀번호는 8~20자 영문,숫자 1자 이상,특수문자 1자 이상으로 조합해주세요");
    	return false; 
    }
    for (var k = 0; k < len; k++) {
        sCh = pw1.charAt(k);
        if (sCh == pw1.charAt(k + 1)) {
            cnt++;
        }
    }
    if (cnt > 2) {
		alert("비밀번호는 연속된 문자(숫자)를 사용하실수 없습니다.");
		this.password.focus();
		return false;		
    }
    var qwerty = "qwertyuiopasdfghjklzxcvbnm";
    var alpha1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var alpha2 = "abcdefghijklmnopqrstuvwxyz";
    var start = 3;
    var seq = "_" + pw1.slice(0, start);
    var numseq = "0" + pw1.slice(0, start);
    for (t = 3; t < len; t++) {
        seq = seq.slice(1) + pw1.charAt(t);
        if (qwerty.indexOf(seq) > -1) { 
    		alert("비밀번호는 연속된 문자(숫자)를 사용하실수 없습니다.");
    		this.password.focus();
    		return false;
        }
    }
    for (t = 3; t < len; t++) {
        numseq = numseq.slice(1) + pw1.charAt(t);
        if (number.indexOf(numseq) > -1) {
    		alert("비밀번호는 연속된 문자(숫자)를 사용하실수 없습니다.");
    		this.password.focus();
    		return false;
        }
    }
    for (t = 3; t < len; t++) {
        seq = seq.slice(1) + pw1.charAt(t);
        if (alpha1.indexOf(seq) > -1) {
    		alert("비밀번호는 연속된 문자(숫자)를 사용하실수 없습니다.");
    		this.password.focus();
    		return false;
        }
    }
    for (t = 3; t < len; t++) {
        seq = seq.slice(1) + pw1.charAt(t);
        if (alpha2.indexOf(seq) > -1) {
    		alert("비밀번호는 연속된 문자(숫자)를 사용하실수 없습니다.");
    		this.password.focus();
    		return false;
        }
    }
    return true;
}

CSPassword.prototype.prevPwKeyDown = function() {
	let prevShowTextID = this.prevShowText.getAttribute("id");
    this.prevPassword.addEventListener("keyup", function(e) {
    	let dataObject = {
    		"sha256_pw" : sha256_digest(this.value),
    		"prevShowTextID" : prevShowTextID
    	};
    	commonAjax(getContextPath() + "/pop/pwchange/prevpw/check", "POST", dataObject, true,prevPwKeyDownAfterAction,false);
    });
}

function prevPwKeyDownAfterAction(response) {
	let prevShowTextID = document.getElementById(response.prevShowTextID);
	if(response.result == "SAME"){
		prevShowTextID.style.color = "#287db2";
		prevShowTextID.innerHTML  = "비밀번호 일치";
		return true;
	} else {
		prevShowTextID.style.color = "#f2521b";
		prevShowTextID.innerHTML  = "비밀번호 불일치";
		return false;
	}
}
