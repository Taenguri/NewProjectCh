function getContextPath() {
    return document.getElementById("ctx").value;
}
function isNull(value) {
    if(value !== undefined && isNaN(value) && typeof value === "string") value = value.trim();

    //let blank_pattern = /^\s+|\s+$/g;
    //if(blank_pattern.test(value)) return true;

    return !value;
}

function replaceNull(value) {
	try {
		if(value !== undefined && isNaN(value)) value = value.trim();
	} catch (e) {
		return isNull(value);
	}
	return isNull(value) ? "" : htmlDecode(value);
}

function htmlDecode(value) {
	let doc = new DOMParser().parseFromString(value, "text/html");
	return doc.documentElement.textContent;
}


function commonAjax(url, method, data, option, callBackFunction, isLoadingImg) {
	if(method.toUpperCase() === "FILE") {
		fileDownload(url, data);
		return;
	}
	let isLoading = (isLoadingImg != null || isLoadingImg !== undefined) ? isLoadingImg : true;
	const ajaxOption = {
		async: typeof option === "boolean" ? option : option.async || true, 
		contentType: option.contentType || "application/x-www-form-urlencoded; charset=utf-8",
	}
	     
    let xhr = new XMLHttpRequest();
	
    if(method.toUpperCase() === "GET") {
        xhr.open(method.toUpperCase(), url + "?" + jsonParamSerialize(data), ajaxOption.async);
    } else {
        xhr.open(method.toUpperCase(), url, ajaxOption.async);
    }

    xhr.setRequestHeader("ajax-request", "true");
    
    if (ajaxOption.contentType !== "multipart/form-data") {
    	  xhr.setRequestHeader("Content-Type", ajaxOption.contentType);
    }
  
    let csrfToken = document.getElementsByName("_csrf")[0].getAttribute("content");
    let csrfHeader = document.getElementsByName("_csrf_header")[0].getAttribute("content");
    xhr.setRequestHeader(csrfHeader, csrfToken);

	if(url.indexOf("session") === -1){
	    ajaxLoadingImage(isLoading);
	}
    const dataOption = {
		"application/x-www-form-urlencoded; charset=utf-8": jsonParamSerialize(data),
		"application/json; charset=utf-8": JSON.stringify(data),
        "multipart/form-data": data
    }
    
    const params = dataOption[ajaxOption.contentType];

    xhr.send(method.toUpperCase() === "GET" ? null : params || data);

    xhr.onreadystatechange = function () {
        if(this.readyState === 4) {
            ajaxLoadingImage(false);

            if(this.status === 200) {
                callBackFunction(this.responseText && JSON.parse(this.responseText));
            } else if(this.status === 6653) {
                alert("로그인 세션이 만료되었습니다.");
                window.location.href =  getContextPath()+'/login';
            } else if(this.status === 400) {
            	alert(this.responseText || "웹 페이지에서 유효하지 않은 요청을 하였습니다.(400)");
            } else if(this.status === 403) {
                alert(this.responseText || "웹 페이지를 볼 수 있는 권한이 없습니다.(403)");
            } else if(this.status === 404) {
                alert("요청하신 페이지를 찾을 수 없습니다.(404)");
            } else if(this.status === 405) {
                if(url.indexOf("login") >= 0) {
                    alert("보안세션이 만료되었습니다.\n다시 로그인해 주시기 바랍니다.");
                    window.location.href = getContextPath() + "/login";
                } else {
                    alert("서버로 올바르지 않은 요청이 들어왔습니다.(405)");
                }
            } else if(this.status === 500) {
                alert("내부서버 오류가 발생하였습니다.(500)");
            } else {

            }
            
            if(url.indexOf("session") === -1 && url.indexOf("logout") === -1 && typeof(sessionExtension) == "function" && this.status !== 6653){
            	sessionExtension();
        	}
        }
    };

    xhr.onerror = function () {
        ajaxLoadingImage(false);
    };
}

function fileDownload(url, data) {
	window.location.href = url + "?" + jsonParamSerialize(data);
}

function ajaxLoadingImage(isShow) {
    if(!document.getElementById("ajaxLoadingDiv")) return false;
    if(isShow) {
        document.getElementById("ajaxLoadingDiv").classList.add("on");
        document.getElementById("ajaxLoadingDiv").style.display = "block";
    } else {
        document.getElementById("ajaxLoadingDiv").classList.remove("on");
        document.getElementById("ajaxLoadingDiv").style.display = "none";
    }
}

function getLabelText(id) {
    return !document.querySelector('label[for="' + id + '"]').innerHTML
        ? document.getElementById(id).getAttribute("title") :
        document.querySelector('label[for="' + id + '"]').innerHTML.trim();
}

function inputNumberOnly(event) {
    let key;
    let isNumber = true;

    if(event.type === "paste") {
        key = event.clipboardData.getData("text/plain");
    } else {
        key = event.keyCode || event.which;
        key = String.fromCharCode(key);
    }

    let regex = /[0-9]|\./;
    if(!regex.test(key)) {
        event.returnValue = false;
        if(event.preventDefault) event.preventDefault();
        isNumber = false;
    }
    return isNumber;
}

function numberWithCommas(num) {
    if(!num && isNaN(num)) return "";
    else if(!isNaN(num) && Number(num) <= 0) return num;
    let parts = num.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

function setEnterEvent(id, callbackFunction, jsonParam) {
    document.getElementById(id).addEventListener("keydown", function (e) {
        if(e.key.toUpperCase() === "ENTER") {
            callbackFunction(jsonParam);
            return false;
        }
    });
}

function getSelectBoxValue(obj) {
    if(isNull(obj)) return "";
    return obj.options[obj.selectedIndex].value;
}

function getSelectBoxText(obj) {
    if(isNull(obj)) return "";
    return obj.options[obj.selectedIndex].text;
}

function jsonParamSerialize(jsonData) {
    if(isNull(jsonData)) return "";
    let resultParam = [];

    for(let data in jsonData) {
        resultParam.push(data + "=" + encodeURIComponent(jsonData[data]))
    }
    return resultParam.join("&");
}

function tableSearch(filterID, tableID) {
    let searchTxt = document.getElementById(filterID);
    let filter = searchTxt.value.toUpperCase();
    let table = document.getElementById(tableID);
    let tbody = table.getElementsByTagName("tbody")[0];
    let tr = tbody.getElementsByTagName("tr");

    for(let i = 0; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName("td");
        let isDisplay = false;

        for(let j = 0; j < td.length; j++) {
            if(td[j]) {
                let txtValue = td[j].textContent || td[j].innerText;
                if(txtValue.toUpperCase().indexOf(filter) > -1) isDisplay = true;
            }
        }

        if(isDisplay) tr[i].style.display = "";
        else tr[i].style.display = "none";
    }
}

//주소 API 팝업 페이지 호출
function requestAddressApi(zipcode, address, detailAddress) {
	let popupWindow=  window.open('', 'jusopopup', 'width=570,height=520,menubar=no, location=no, status=no, toolbar=no' );
	popupWindow.location.href = getContextPath() + "/pop/juso/" + zipcode + "/" + address + "/" + detailAddress;
}

//rtRoadFullAddr : 전체주소 , rtAddrPart1 : 도로명 주소 ,  rtAddrDetail: 상세주소 , rtAddrPart2 : 검색결과의 건물이름 등, rtZipNo: 우편번호
function jusoCallBack(addrID, detailAddrID, zipNoID, rtRoadFullAddr, rtAddrPart1, rtAddrDetail, rtAddrPart2, rtZipNo) {
	document.getElementById(addrID).value = rtAddrPart1 + " " + rtAddrPart2;
	document.getElementById(detailAddrID).value = rtAddrDetail;
	document.getElementById(zipNoID).value = rtZipNo;
}

//입력한 항목 숫자 체크
function checkNumber(word) {
    let str = "1234567890";
    let ch;
    for (let i = 0; i < word.length; i++) {
        ch = word.charAt(i);
        for (let j = 0; j < str.length; j++) {
            if (ch === str.charAt(j)) break;
            if (j + 1 === str.length) { return false; }
        }
    }
    return true;
}

function getByteCheck(limitLength, text) {
	let strByteLength = "";
	let resultCheck = false;
	
	for(let i = 0; i< text.length; i++){
		let code = text.charCodeAt(i);
		let ch = text.substr(i, 1).toUpperCase();
		
		code = parseInt(code);
		
		if ((ch < "0" || ch > "9") && (ch < "A" || ch > "Z") && ((code > 255) || (code < 0))) {
            strByteLength = Number(strByteLength) + 3; //UTF-8 3byte 로 계산
        } else {
            strByteLength = Number(strByteLength) + 1;
        }
	}
	
	if(limitLength < strByteLength) resultCheck = true;
	return resultCheck;
}

function getCheckValue(cCheckBoxName, sep) {
	let array = [];
    Array.from(document.querySelectorAll("input[name=" + cCheckBoxName +"]")).forEach(
      function(each) {
          if(each.checked) array.push(each.value);
      }
    );
	return array.join(sep ? sep : ",");
}

/**
 * Html closest 요소를 가져오는 함수
 * @param elem
 * @param selector
 * @param type
 * @returns {null|*}
 */
function getClosest (elem, selector, type) {
    if ('TAG' === type ) {
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if (elem.tagName.toUpperCase() === selector.toUpperCase()) return elem;
        }
    } else if ('CLASS' === type) {
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if (elem.className.toUpperCase().indexOf(selector.toUpperCase()) > -1) return elem;
        }
    } else if ('ID' === type) {
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if (elem.id.toUpperCase() === selector.toUpperCase()) return elem;
        }
    } else if ('ATTR' === type) {
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if (elem.getAttribute(selector)) return elem;
        }
    }
    return null;
}

/**
 * 인자값에 따라 객체를 생성해주는 함수
 * @param paramObj
 * @returns {null|ActiveX.IXMLDOMElement}
 */
function createEl(paramObj){
    if (!paramObj) {
        console.warn('invalid input');
        return null;
    } else if(!paramObj['tagName']) {
        console.warn('invalid tagName');
        return null;
    }
    let el = document.createElement(paramObj['tagName']);

    if('input' === paramObj['tagName'] && paramObj['type']){
        el.setAttribute('type', paramObj['type']);
    }
    if(paramObj['value']){
        el.value = paramObj['value'];
    }
    if(paramObj['classArr'] && paramObj['classArr'].length > 0) {
        if(Array.isArray(paramObj['classArr'])) {
            paramObj['classArr'].forEach(function(item) {
                el.classList.add(item);
            });
        } else {
            el.classList.add(paramObj['classArr']);
        }
    }
    if(paramObj['clickEvt']) {
        let fn = paramObj['clickEvt'];
        el.addEventListener('click', function(e) {
            fn(e.target);
            e.preventDefault();
        });
    }
    if(paramObj['inObjs']) {
        if(Array.isArray(paramObj['inObjs'])) {
            paramObj['inObjs'].forEach(function(oj) {
                el.appendChild(oj);
            });
        } else {
            el.appendChild(paramObj['inObjs']);
        }

    }
    if(paramObj['inTxt']) {
        el.innerText = paramObj['inTxt'];
    }
    if(paramObj['inHtml']) {
        el.innerHTML = paramObj['inHtml'];
    }
    if(paramObj['name']) {
        el.setAttribute('name', paramObj['name']);
    }
    if(paramObj['id']) {
        el.id = paramObj['id'];
    }
    return el;
}

function createLabel(forTarget, inText){
    let labelObj = document.createElement('label');
    if (forTarget) {
        labelObj.setAttribute('for', forTarget);
    }
    if (inText) {
        labelObj.innerText = inText;
    }
    return labelObj;
}

const fileManager = (function() {
	const imageByExt = {
		xls: "/images/file/excel.png",
		xlsx: "/images/file/excel.png",
		hwp: "/images/file/hwp.png",
		pdf: "/images/file/pdf.png",
		ppt: "/images/file/ppt.png",
		pptx: "/images/file/ppt.png",
		txt: "/images/file/txt.png",
		doc: "/images/file/word.png",
		docx: "/images/file/word.png",
		png: "/images/file/img.gif",
		jpg: "/images/file/img.gif",
		jpeg: "/images/file/img.gif",
		bmp: "/images/file/img.gif",
		"7z": "/images/file/7z.png",
		xlsb: "/images/excel.png"
	}
	
	function _getStateSynapPreview(file) {
		commonAjax(
			getContextPath() + "/eval/submitstatus/synap", 
			"GET", 
			{ 
				file_seq: file.fileId,
				seq: file.order, 
				data_year: file.dataYear,
				value_sphere: file.valueSphere,
				lib_code: file.libCode
			}, 
			true, 
			function(data) {
				
			}
		);
	}
	
	const fileType = {
		submitStatus: {
			getSynapPreview: _getStateSynapPreview
		},
		pointStatus: {
			getSynapPreview: _getStateSynapPreview
		},
		actualStatus: {
			getSynapPreview: _getStateSynapPreview
		},
		common: {
			getSynapPreview: function(file) {
			commonAjax(
					getContextPath() + "/filemanager/synap", 
					"GET", 
					{ id: file.fileId, order: file.order }, 
					true, 
					function(data) {
						
					}
				);
			}
		}
	}
	
	const baseSynapURL = "/previews/skin/doc.html?";
	
	function getExtension(fileName) {
		return fileName.split(".").pop().toLowerCase();
	}
	
	function getSynapURL(viewName, viewPath) {
		return getContextPath() + baseSynapURL + "fn=" + viewName + "&rs=" + getContextPath() + viewPath; 
	}
	
	function isSynapSupportedExtension(extension) {
		return ['xls', 'xlsx', 'pdf', 'ppt', 'pptx', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'bmp', 'hwp', 'txt', 'tiff', 'gif', 'xlsb']
			.some(function(e) { return e === extension.toLowerCase() });
	}
	
	function getPreviewHTML(fileName, viewName, viewPath, hasIcon) {
		return isSynapSupportedExtension(getExtension(fileName)) ? 
			'<a class="' + (hasIcon ? "" : "btn") + '" target="_blank" href="' + getContextPath() + getSynapURL(viewName, viewPath) + '">' + (hasIcon ? "🔍" : "미리보기") + '</a>' :
			'';
	}
	
	function getFileIconHTML(fileName, useCSS) {
		return useCSS ?
			"<span style='background-image: url(" + getContextPath() + (fileManager.imageByExt[fileManager.getExtension(fileName)] || "/images/file.gif") + ")'>첨부</span>" :
			"<img src='" + getContextPath() + (fileManager.imageByExt[fileManager.getExtension(fileName)] || "/images/file.gif") + "' alt='file icon' />";
			/*"<span style=background-image:url('" + getContextPath() + (fileManager.imageByExt[fileManager.getExtension(fileName)] || "/images/file.gif") + "')>첨부</span>" :
			"<img src='" + getContextPath() + (fileManager.imageByExt[fileManager.getExtension(fileName)] || "/images/file.gif") + "' alt='file icon' />";*/
	}
	
	return {
		imageByExt: imageByExt,
		getExtension: getExtension,
		getSynapURL: getSynapURL,
		isSynapSupportedExtension: isSynapSupportedExtension,
		getPreviewHTML: getPreviewHTML,
		getFileIconHTML: getFileIconHTML
	}
})();

function dateSearchSetting(startDateId, endDateId, nowDateId){
	if(document.getElementById(startDateId).value !== ""){
		if(isNull(document.getElementById(endDateId).value)){
			document.getElementById(endDateId).value = document.getElementById(nowDateId).value;
		}
	} else {
		if(document.getElementById(endDateId).value !== ""){
			document.getElementById(startDateId).value = document.getElementById(endDateId).value;
		} else {
			document.getElementById(startDateId).value = document.getElementById(nowDateId).value;
			document.getElementById(endDateId).value = document.getElementById(nowDateId).value;
		}
	}

	return validDatePicker(document.getElementById(startDateId).value, document.getElementById(endDateId).value);
}

//날짜간 차이일수 구하기 (날짜형식 : yyyy-mm-dd)
function getDiffDay(startDate, endDate) {
	let start_yyyy = startDate.substring(0,4);
	let start_mm = startDate.substring(5,7);
	let start_dd = startDate.substring(8,startDate.length);
	let sDate = new Date(start_yyyy, start_mm-1, start_dd);
	let end_yyyy = endDate.substring(0,4);
	let end_mm = endDate.substring(5,7);
	let end_dd = endDate.substring(8,endDate.length);
	let eDate = new Date(end_yyyy, end_mm-1, end_dd);
	let diffDay;
    diffDay = Math.ceil((eDate.getTime() - sDate.getTime())/(1000*60*60*24));

    return diffDay;
} 

function validDatePicker(startDate, endDate){
	let result = getDiffDay(startDate, endDate);
	if(result < 0) {
		alert("시작일이 종료일보다 클 수 없습니다."); 
		return 0;
	}else if(result > 30 ){
		alert("최대 조회일수는 1개월 입니다.");
		return 0;
	}
	return 1;
}

function getParameterByName(source) {
	let name = source.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	let regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
	let results = regex.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getFormCsrfInputElement() {
    let csrfToken = document.getElementsByName("_csrf")[0].getAttribute("content");
    let csrf = document.createElement("input");
    csrf.setAttribute("type", "hidden");
    csrf.setAttribute("name", "_csrf");
    csrf.setAttribute("value", csrfToken);
    return csrf;
}

function dragElement(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if(document.getElementById(element.id + "header")) {
        document.getElementById(element.id + "header").onmousedown = dragMouseDown;
    } else {
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e.preventDefault();

        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function isMobileDevice() {
    let device = "win16|win32|win64|mac|macintel";
    return navigator.platform && device.indexOf(navigator.platform.toLowerCase()) < 0;
}

function makeSelectBox (dataList, selector, defaultText, key, value) {
    const selectBox = document.querySelector(selector);
    const arr = [];

    if (defaultText) arr.push(`<option value=''>${defaultText}</option>`);

    if (dataList && dataList.length > 0) {
        dataList.forEach(data => {
            arr.push(`<option value='${data[key.toUpperCase()]}'>${data[value.toUpperCase()]}</option>`);
        });
    }

    selectBox.innerHTML = arr.join("");
}