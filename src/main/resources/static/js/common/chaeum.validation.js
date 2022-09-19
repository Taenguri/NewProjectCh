function CSValidation(id) {
    this.obj = document.getElementById(id)
    this.checkTag = "input, select, textarea";
}

CSValidation.prototype.isRequiredData = function() {
    let arr = [];
    let idx = 0;
    let status = true;

    Array.from(this.obj.querySelectorAll(this.checkTag)).forEach(function (item) {
        if(!status) return status;
        let required = item.getAttribute("required");

        if( typeof required !== "undefined" && required != null ) {
            let id = item.getAttribute("id");

            if (!item.value) {
                arr[idx++] = getLabelText(id);

                if ( item.tagName === "INPUT" || item.tagName === "TEXTAREA" ) {
                    arr[idx++] = "은(는) 필수로 입력해 주십시오.";
                    alert(arr.join(''));
                } else if ( item.tagName === "SELECT" ) {
                    arr[idx++] = "은(는) 필수로 선정해 주십시오.";
                    alert(arr.join(''));
                }

                item.focus();
                status = false;
                return status;
            }
        }
    });

    return status;
}

CSValidation.prototype.isDataType = function() {
    let arr = [];
    let idx = 0;
    let status = true;

    Array.from(this.obj.querySelectorAll(this.checkTag)).forEach(function (item) {
        if(!status) return status;
        let dataType = item.getAttribute("validation-type") != null ? item.getAttribute("validation-type").toLowerCase() : null;

        if( typeof dataType !== "undefined" && dataType !== null ) {
            let label = getLabelText(item.getAttribute("id"));
            let value = item.value;

            if(value) {
                if ( dataType === "number" && !/^[0-9]+$/.test(value) ) {
                    arr[idx++] = label + "에는 숫자만 입력하실 수 있습니다.";
                    status = false;
                } else if ( dataType === "date" && !/^(19[7-9][0-9]|20\d{2}).(0[0-9]|1[0-2]).(0[1-9]|[1-2][0-9]|3[0-1])$/.test(value) ) {
                    arr[idx++] = label + "날짜형식(YYYY.MM.DD)만 입력하실 수 있습니다.";
                    status = false;
                } else if ( dataType === "year" && !/^(19[7-9][0-9]|20\d{2})$/.test(value) ) {
                    arr[idx++] = label + "날짜형식(YYYY)만 입력하실 수 있습니다.";
                    status = false;
                } else if ( dataType === "engnum" && !/^[a-z|A-Z|0-9\*]+$/.test(value) ) {
                    arr[idx++] = label + "에는 숫자 및 영문만 입력하실 수 있습니다.";
                    status = false;
                } else if ( dataType === "eng" && !/^[A-Z|a-z]+$/.test(value) ) {
                    arr[idx++] = label + "에는 영문만 입력하실 수 있습니다.";
                    status = false;
                } else if ( dataType === "enghan" && !/^[ㄱ-ㅎ|가-힣|a-z|A-Z|\*]+$/.test(value) ) {
                    arr[idx++] = label + "에는 한글 및 영문만 입력하실 수 있습니다.";
                    status = false;
                } else if ( dataType === "hanspe" && !/^[ㄱ-ㅎ|가-힣|~!@\#$%<>^&*\()\-=+\',.`";:<>/?\[\]\-\\+_=|\\]+$/.test(value) ) {
                    arr[idx++] = label + "에는 한글 및 특수문자만 입력하실 수 있습니다.";
                    status = false;
                } else if ( dataType === "hannum" && !/^[ㄱ-ㅎ|가-힣|0-9|\*]+$/.test(value) ) {
                    arr[idx++] = label + "에는 한글 및 숫자만 입력하실 수 있습니다.";
                    status = false;
                } else if ( dataType === "engspe" && !/^[a-z|A-Z|~!@\#$%<>^&*\()\-=+\',.`";:<>/?\[\]\-\\+_=|\\]+$/.test(value) ) {
                    arr[idx++] = label + "에는 영문 및 특수문자만 입력하실 수 있습니다.";
                    status = false;
                } else if ( dataType === "numspe" && !/^[0-9|~!@\#$%<>^&*\()\-=+\',.`";:<>/?\[\]\-\\+_=|\\]+$/.test(value) ) {
                    arr[idx++] = label + "에는 숫자 및 특수문자만 입력하실 수 있습니다.";
                    status = false;
                } else if ( dataType === "special" && !/^[~!@\#$%<>^&*\()\-=+\',.`";:<>/?\[\]\-\\+_=|\\]+$/.test(value) ) {
                    arr[idx++] = label + "에는 특수문자만 입력하실 수 있습니다.";
                    status = false;
                } else if ( dataType === "email" && !/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(value) ) {
                    arr[idx++] = label + "에는 이메일 형식만 입력하실 수 있습니다.";
                    status = false;
                } else if ( dataType === "tel" && !/^\d{2,3}-\d{3,4}-\d{4}$/.test(value) ) {
                    arr[idx++] = label + "에는 집전화번호 형식만 입력하실 수 있습니다.";
                    status = false;
                } else if ( dataType === "phone" && !/^\d{3}-\d{3,4}-\d{4}$/.test(value) ) {
                    arr[idx++] = label + "에는 핸드폰 번호 형식만 입력하실 수 있습니다.";
                    status = false;
                } else if ( dataType === "tel_and_phone" && !/^\d{2,3}-\d{3,4}-\d{4}$/.test(value) && !/^\d{3}-\d{3,4}-\d{4}$/.test(value) ) {
                    arr[idx++] = label + "에는 하이픈(-) 을 포함한 연락처 형식만 입력하실 수 있습니다.";
                    status = false;
                } else if ( dataType === "emaildomain" && !/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(value) ){
                    arr[idx++] = "부적절한 " + label + "입니다.";
                    status = false;
                } else if ( dataType === "barnum" && !/^\d{3}-\d{2}-\d{5}$/.test(value)) {
                    arr[idx++] = label + "에는 사업자번호 형식만 입력하실 수 있습니다.";
                    status = false;
                }

                if ( !status ) {
                    alert(arr.join(''));
                    item.focus();
                    return status;
                }
            }
        }
    });

    return status;
}

////////////// prototype end //////////////

function isSupportedFileExtension(id, supportedExtensions) {
    if ( !Array.isArray(supportedExtensions) ) {
        throw new Error("supportedExtensions parameter type is not array");
    }

    let file = document.getElementById("id");

    if ( file.value.trim().length < 1) {
        alert("파일을 선정해 주십시오.");
        file.focus();
        return false;
    }

    let extension = file.value.split(".");
    let supported = false;

    for ( let i = 0, len = supportedExtensions.length; i < len; i++ ) {
        if ( extension[extension.length - 1].toLowerCase() === supportedExtensions[i].toLowerCase() ) {
            supported = true;
            break;
        }
    }

    if ( !supported ) {
        alert("파일은 " + supportedExtensions.join(', ') + "확장자만 등록 할 수 있습니다.");
        file.focus();
    }

    return supported;
}

function unescapeHtml(str) {
    if(isNull(str)) return "";
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&#39;/g, "'");
}

function isDateValidationCheck(startObj, endObj) {
    if(isNull(startObj.value) && isNull(endObj.value)) return true;
    if(!isNull(startObj.value) && isNull(endObj.value)) endObj.value = startObj.value;
    else if(isNull(startObj.value) && !isNull(endObj.value)) startObj.value = endObj.value;

    let startDate = startObj.value.replace(/[^0-9]/g, '');
    let endDate = endObj.value.replace(/[^0-9]/g, '');

    if(Number(startDate) > Number(endDate)) {
        alert("시작일자가 종료일자보다 클 수 없습니다.");
        startObj.focus();
        return false;
    }
    return true;
}