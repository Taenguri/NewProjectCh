const CustomCKEditor = function(instance) {
	
	function fileUploadRequest() {
		instance.on("fileUploadRequest", function(e) {
			const xhr = e.data.fileLoader.xhr;

			xhr.open("POST", getContextPath() + "/filemanager/ckeditor/", true);
			
			const csrfToken = document.getElementsByName("_csrf")[0].getAttribute("content");
			const csrfHeader = document.getElementsByName("_csrf_header")[0].getAttribute("content");
			xhr.setRequestHeader(csrfHeader, csrfToken);
			
			const form = new FormData();
			form.append("upload", e.data.fileLoader.file);
		    xhr.send(form);

		    e.stop();
		})

		return this;
	}
	
	return {
		fileUploadRequest: fileUploadRequest
	}
	
};