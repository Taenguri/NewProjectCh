const exampleController = (function () {
    let classCodeList;
    const BASE_URI = getContextPath() + "/manager/env/codemng/classcode";

    const Elements = (function () {
        const classCode = document.getElementById("class_code");
        const classCodeDesc = document.getElementById("class_code_desc");
        const inputPopBtn = document.getElementById("classCodeInputPopBtn");
        const classCodeTable = document.getElementById("classCodeTbl");
        const moveCode = document.getElementById("moveCode");

        return {
            classCode,
            classCodeDesc,
            inputPopBtn,
            classCodeTable,
            moveCode
        };
    })();

    const classCodeInputDlg = new Dialog.New({
        closeEvent : function () {
            resetClassCodeInputPop();
        },
        id : "classCodeInputDlg"
    });

    function getClassCodeInfo() {
        commonAjax(BASE_URI, "GET", null,  true, makeClassCodeInfoTbl);
    }

    function makeClassCodeInfoTbl(response) {
        const tbody = Elements.classCodeTable.getElementsByTagName("tbody")[0];

        if(response !== null && response.length > 0) {
            classCodeList = response;
            let htmlBody = [];

            for(let i = 0; i < classCodeList.length; i++) {
                htmlBody.push("<tr>");
                htmlBody.push("<td>" + classCodeList[i].CLASS_CODE + "</td>");
                htmlBody.push("<td>" + classCodeList[i].CLASS_CODE_DESC + "</td>");
                htmlBody.push("<td>");
                htmlBody.push("<div class='btn_area'>");
                htmlBody.push("<button class='btn_edit btn' type='button' name='classCodeUpdatePopBtn' value='" + i + "'>수정</button>");
                htmlBody.push("<button class='btn_delete btn' type='button' name='classCodeDeleteBtn' value='" + classCodeList[i].CLASS_CODE + "'>삭제</button>");
                htmlBody.push("</div>");
                htmlBody.push("</td>");
                htmlBody.push("</tr>");
            }
            tbody.innerHTML = htmlBody.join('');

            Array.from(document.querySelectorAll("button[name=classCodeUpdatePopBtn]")).forEach(
                function (e) {
                    e.addEventListener("click", function () {
                        classCodeInputPop("UPDATE", e.value);
                    });
                }
            );

            Array.from(document.querySelectorAll("button[name=classCodeDeleteBtn]")).forEach(
                function (e) {
                    e.addEventListener("click", function () {
                        transactionClassCodeInfo("DELETE", e.value);
                    });
                }
            );
        } else {
            tbody.innerHTML = "<td colspan=\"100%\">클래스코드정보가 업습니다.</td>";
        }
    }

    function transactionClassCodeInfo(type, key) {
        const uri = BASE_URI;
        const method = type === "INSERT" ? "PUT" : (type === "UPDATE" ? "PATCH" : "DELETE");
        let dataObject = {};

        if(type === "DELETE") {
            if(!confirm("선택하신 클래스코드를 삭제하시겠습니까?\n하위에 입력된 코드가 모두 삭제됩니다.")) return false;
            if(!key) {
                alert("삭제하실 클래스코드를 선택해 주십시오.");
                return false;
            }
            dataObject.class_code = key;
        } else {
            if(!confirm("클래스코드 정보를 저장하시겠습니까?")) return false;
            let validation = new CSValidation("classCodeInputDlg");
            if(!validation.isRequiredData()) return false;

            dataObject.class_code = Elements.classCode.value;
            dataObject.class_code_desc = Elements.classCodeDesc.value;
        }

        commonAjax(uri, method, dataObject, true, function (response) {
            if(response.result === "success") {
                if(type === "DELETE") alert("클래스코드 정보가 삭제되었습다.");
                else alert("클래스코드 정보가 저장되었습니다.");
                getClassCodeInfo();
                classCodeInputDlg.close();
            } else {
                alert(response.msg);
            }
        });
    }

    function classCodeInputPop(type, idx) {
        if(type === "UPDATE") {
            Elements.classCode.value = classCodeList[idx].CLASS_CODE;
            Elements.classCodeDesc.value = classCodeList[idx].CLASS_CODE_DESC;
        }

        Elements.classCode.readOnly = type === "UPDATE";

        classCodeInputDlg.setOption({
            title : "클래스코드 " + (type === "INSERT" ? "입력" : "수정"),
            buttons : [
                {
                    text : "저장",
                    primary : true,
                    click : function () {
                        transactionClassCodeInfo(type);
                    }
                }
            ]
        });

        classCodeInputDlg.open();
    }

    function resetClassCodeInputPop() {
        Elements.classCode.value = "";
        Elements.classCodeDesc.value = "";
    }

    function setEventListener() {
        Elements.inputPopBtn.addEventListener("click", function () { classCodeInputPop("INSERT"); });
        Elements.moveCode.addEventListener("click", function () { window.location.href = getContextPath() + "/manager/env/codemng/codepage"; });
    }

    function init() {
        getClassCodeInfo();
        setEventListener();
    }

    return {
        init
    };
})();

exampleController.init();