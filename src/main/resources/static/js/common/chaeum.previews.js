const chaeumPreview = function() {
    document.addEventListener("DOMContentLoaded", function() {
        Array.from(document.querySelectorAll(".preview_btn")).forEach(function(item) {
            item.addEventListener('click', function(event) {
                openPreviewWindow(event.target.value);
            })
        });
    });
};
chaeumPreview();

function openPreviewWindow(clickedValue) {
    // 리스트일때의 스크립트
    if (!clickedValue) {
        alert("Invalid ClickedID");
        return;
    }
    let previewNameObj = document.getElementById("preview_name_" + clickedValue);
    let previewPathObj = document.getElementById("preview_path_" + clickedValue);
    if (!previewNameObj || !previewPathObj) {
        alert("Invalid Id");
        return;
    }

    let viewName = previewNameObj.value;
    let viewPath = previewPathObj.value;
    if (!viewName || !viewPath) {
        alert("Invalid Value");
        return;
    }

    let previewUrl = getContextPath() + "/previews/skin/doc.html?fn=" + viewName + "&rs=" + getContextPath() + viewPath;
    window.open(previewUrl, null, "width=800, height=700, toolbar=no, menubar=no, scrollbars=no, resizable=yes");
}