
/*
*  네비게이션 클릭 이벤트 관리
* */
document.addEventListener("DOMContentLoaded", function() {
    Array.from(document.querySelectorAll('.nav > article > ul > li > a')).forEach(function(item) {
        if(item.getAttribute('href') && window.location.href.includes(item.getAttribute('href'))){
            // navigation highlight
            let url = window.location.href.replace(getContextPath(), '').replace(window.location.origin, '').split('/');
            let splittedUrlStrList = [];
            for ( let i = 0 ; i < url.length ; i++ ){
                if(url[i]) {
                    splittedUrlStrList.push(url[i]);
                }
            }
            let firstLevelMenuObj = item.parentNode.parentNode.parentNode;
            let lastLevelMenuObj = item.parentNode;
            for ( let i=0; i < splittedUrlStrList.length; i++ ){
                if (i < splittedUrlStrList.length - 1) {
                    firstLevelMenuObj.classList.add(splittedUrlStrList[i]);
                } else {
                    lastLevelMenuObj.classList.add(splittedUrlStrList[i]);
                }
            }

            // title
            document.getElementsByTagName("title")[0].innerText = item.innerText;
            // init body classname
            document.getElementsByTagName("body")[0].className = '';

            for ( let i=0; i < splittedUrlStrList.length; i++ ){
                document.getElementsByTagName("body")[0].classList.add(splittedUrlStrList[i]); // 추가할 classname
            }
            
            let top_menu_name = item.getAttribute("top_menu_name");
            let menu_name = item.getAttribute("menu_name");
            document.querySelector('header[class="sectionHeader"]').innerHTML = "<h2>"+menu_name+"</h2><ol><li>"+top_menu_name+"</li><li>"+menu_name+"</li></ol>";
        }
    });
    
    //setNavOpenButton();
});

/*function setNavOpenButton(e) {
	localStorage.getItem("nav") === "off" ? document.body.classList.remove("navOff") : document.body.classList.add("navOff");
			
	Array.from(document.querySelectorAll(".btnNavOpen, .btnNavClose")).forEach(function(button) {
		button.addEventListener("click", function(e) {
			localStorage.setItem("nav", document.body.classList.toggle("navOff") ? "on" : "off");
		})
	})
}*/