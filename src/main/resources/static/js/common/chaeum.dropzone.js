const CustomDropzone = (function() {
	const dropzones = [];

	Dropzone.autoDiscover = false;
	
	const imageByExt = {
		pdf: "/images/pdf.png",
		xlsx: "/images/excel.png",
		xls: "/images/excel.png", 
		doc: "/images/word.png",
		docx: "/images/word.png",
		ppt: "/images/pptx.png",
		pptx: "/images/pptx.png",
		hwp: "/images/hwp.png",
		zip: "/images/zip.png",
		zipx: "/imags/zip.png",
		egg: "/images/egg.png",
		rar: "/images/rar.png",
		alz: "/images/alz.png",
		"7z": "/images/7z.png",
		xlsb: "/images/excel.png"
	}
	
	const dropzoneType = (function() {
		function _getStatusSendData(userType) {
			return function(seq) {
				return {
					lib_code: document.getElementById("lib_code").value,
			        data_year: document.getElementById("data_year").value,
			        fileId: seq.replace(/\-/g,""),
			        user_type: userType
				}
			}
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
					_renderSynapPreview(file)
				);
		}
		
		return {
			submitStatus: {
				display: {
					getURL: function() { return getContextPath()  + "/eval/submitstatus/fileUpload" },
					getSendData: _getStatusSendData('1')
				},
				getSynapPreview: _getStateSynapPreview
			},
			pointStatus: {
				display: {
					getURL: function() { return getContextPath()  + "/eval/submitstatus/fileUpload" },
					getSendData: _getStatusSendData('2')
				},
				getSynapPreview: _getStateSynapPreview
			},
			actualStatus: {
				display: {
					getURL: function() { return getContextPath()  + "/eval/submitstatus/fileUpload" },
					getSendData: _getStatusSendData('3')
				},
				getSynapPreview: _getStateSynapPreview
			},
			common: {
				display: {
					getURL: function(fileId) { return getContextPath()  + "/filemanager/" + fileId },
					getSendData: function() {}
				},
				getSynapPreview: function(file) {
					if (!_isSynapSupportedExtension(_getExtension(file))) return;

					commonAjax(
						getContextPath() + "/filemanager/synap", 
						"GET", 
						{ id: file.fileId, order: file.order }, 
						true, 
						_renderSynapPreview(file)
					);
				}
			}
		}
	})();
	
	function _isSynapSupportedExtension(extension) {
		return ['xls', 'xlsx', 'pdf', 'ppt', 'pptx', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'bmp', 'hwp', 'txt', 'tiff', 'gif', 'xlsb']
			.some(function(e) { return e === extension.toLowerCase() });
	}
	
	const events = {
		addedfile: function(file) {
			const customDropzone = CustomDropzone.get(this.element.id);
			if (!_validateMaxFiles.call(this, customDropzone, file)) return;
			// if (!_validateFileSize.call(this, customDropzone, file)) return;
			if (!_validateTotalFileSize.call(this, customDropzone, file)) return;
			if (!_validateAcceptedFileExtention.call(this, customDropzone, file)) return;

			if (imageByExt[_getExtension(file)]) _addThumbnailImage(file);

			customDropzone.totalFiles.push(file);
			_addDescription(file);

			if (file.existOnServer) {
				this.files.push(file);
				_addDownloadEvent(file);
				dropzoneType[customDropzone.option.type || "common"].getSynapPreview(file);
			} else {
				customDropzone.newSavedFiles.push(file);
			}
		},
		removedfile: function(file) {
			const customDropzone = CustomDropzone.get(this.element.id);
			
			if (file.isRemoved) return;
			
			customDropzone.totalFiles.splice(_getRemovedIndex(customDropzone.totalFiles, file), 1);

			if (file.existOnServer) customDropzone.deletedFiles.push(file)
			else customDropzone.newSavedFiles.splice(_getRemovedIndex(customDropzone.newSavedFiles, file), 1);
		}
	}

	const defaultOption = {
		url: "/filemanager/dropzone", // meaningless
		autoProcessQueue: false,
		uploadMultiple: true,
		// maxFilesize: 20, 
		maxFiles: 10,
		maxFileTotalSize: 100, 
		parallelcustomDropzone: 10, 
		addRemoveLinks: true,
		downloadFile: true,
		dictMaxFilesSize: "업로드 가능한 용량을 초과하였습니다.",
		dictInvalidFileType: "업로드 가능한 파일 유형이 아닙니다.",
		dictRemoveFile: "❌",
		acceptedFiles: ".jpg,.png,.bmp,.gif,.jpeg,.txt,.pdf,.hwp,.xls,.xlsx,.pptx,.ppt,.doc,.docx,.cell,.zip,.zipx,.rar,.alz,.egg,.7z,.xlsb",	
		init: function() {
			this.on("addedfile", events.addedfile);
			this.on("removedfile", events.removedfile);
			
			const _this = this;
			setTimeout(function() { _displayExistingFiles.call(_this); }, 0);
		}
	}

	function _setDefaultMessage(obj) {
		const messageUploadLimit = [
			obj.maxFiles && "파일 최대 " + obj.maxFiles + "개",
			// obj.maxFilesize && "개당 " + obj.maxFilesize + "MB",
			obj.maxFileTotalSize && "전체 용량 " + obj.maxFileTotalSize + "MB"
		]

		return  ('<div class="dz-default dz-message file-dropzone text-center well">'
				+	'<span>첨부파일을 여기에 드래그 &amp; 드롭 또는 클릭하여 추가 후 파일업로드 클릭</span><br>'
				+	'<span>Html5를 지원하지 않는 브라우져는 이곳을 클릭하여 주십시오.</span><br><br>'
				+	'<span>' + (messageUploadLimit.filter(Boolean).length > 0 ? " ※ 업로드 제한 : " + messageUploadLimit.join(", ") : "") + '</span><br>'
				+	'<span> ※ 오류 발생시 팝업창을 다시 열어 파일을 하나씩 업로드하시기 바랍니다.</span>'
				+'</div>')
	}

	function _camelize(str) {
	  return str.replace(/[\-_](\w)/g, function (match) {
	    return match.charAt(1).toUpperCase();
	  });
	}
	
	function _displayExistingFiles() {
		const customDropzone = CustomDropzone.get(this.element.id);
		const fileId = customDropzone.fileId;
		
		if (!fileId) return;
		
		const _this = this;
		const displayType = dropzoneType[customDropzone.option.type || "common"].display;

		commonAjax(displayType.getURL(fileId), "GET", displayType.getSendData(fileId), true, function(data) {
			data.forEach(function(each) {
				_this.displayExistingFile(
					{ 
						existOnServer: true, 
						name: each.ORIGNL_FILE_NM, 
						size: each.FILE_SIZE, 
						order: each.FILE_SN, 
						url: each.URL,
						fileId: each.ATCH_FILE_ID || each.FILE_ID,
						viewName: each.VIEW_NAME,
						viewPath: each.VIEW_PATH,
						dataYear: each.DATA_YEAR,
						libCode: each.LIB_CODE,
						valueSphere: each.VALUE_SPHERE
					},
					getContextPath() + (imageByExt[_getExtension({ name: each.ORIGNL_FILE_NM })] || each.URL)
				);
			 })
		});
	}
	
	function _validateMaxFiles(customDropzone, file) {
		if (customDropzone.totalFiles.length < this.options.maxFiles) return true;
		
		alert("최대 허용 파일 수는 " + this.options.maxFiles + "건 입니다.");
		
		file.isRemoved = true;
		this.removeFile(file);
		return false;
	}
	
	function _validateFileSize(customDropzone, file) {
		if (file.size <= customDropzone.option.maxFilesize * 1000000) return true;
		
		alert("최대 허용 파일 용량은 " + customDropzone.option.maxFilesize + "MB 입니다.");
		
		file.isRemoved = true;
		this.removeFile(file);
		
		return false;
	}
	
	function _validateTotalFileSize(customDropzone, file) {
		const currentTotalSize = customDropzone.totalFiles.reduce(function(acc, cur) { return acc + cur.size }, 0);
		const thisFileSize = file.size;
		
		if (currentTotalSize + thisFileSize <= customDropzone.option.maxFileTotalSize * 1000000) return true;
		
		alert("모든 파일들의 총 용량이 " + customDropzone.option.maxFileTotalSize + "MB 를 넘을 수 없습니다.");
		
		file.isRemoved = true;
		this.removeFile(file);
		
		return false;
	}
	
	function _validateAcceptedFileExtention(customDropzone, file) {
		const acceptedFiles = customDropzone.option.acceptedFiles;
		
		if (!acceptedFiles) return true;
		
		const fileExt = "." + _getExtension(file);
		const isAcceptedFile = acceptedFiles.split(",").some(function(ext) { return ext === fileExt; });

		if (isAcceptedFile) return true;
		
		alert(customDropzone.option.dictInvalidFileType || "업로드 가능한 파일 유형이 아닙니다.");
		file.isRemoved = true;
		this.removeFile(file);
		
		return false;
	}
	
	function _getExtension(file) {
		return file.name.split(".").pop().toLowerCase();
	}
	
	function _getRemovedIndex(array, element) {
		return array.findIndex(function(each) { return element === each });
	}
	
	function _addDownloadEvent(file) {
		const details = file.previewElement.querySelector(".dz-details");
		details.style.cursor = "pointer";
		details.addEventListener("click", function(e) { location.href = file.url; })
	}
	
	function _renderSynapPreview(file) {
		return function(data) {
			if (!data.view_name || !data.view_path) return;
			const a = document.createElement('a');
			a.setAttribute("class", "dz-remove")
		    a.setAttribute('href', getContextPath() + "/previews/skin/doc.html?fn=" + data.view_name + "&rs=" + getContextPath() + data.view_path);
			a.setAttribute("target", "_blank");
		    a.innerHTML = "🔍";    
		    
		    file.previewTemplate.appendChild(a);
		    file.previewTemplate.style.textAlign = "center";
		    file.previewTemplate.querySelector(".dz-remove").style.display = "inline";
		    a.style.display = "inline";
		}
	}

	function _addThumbnailImage(file) {
		const thumbnail = file.previewElement.querySelector(".dz-image img");
		thumbnail.setAttribute("src", getContextPath() + imageByExt[_getExtension(file)] || "");
		thumbnail.setAttribute("width", "100%");
		thumbnail.setAttribute("height", "100%");
	}
	
	function _getHumanReadableFileSize(bytes, si, dp) {
	  if (si === undefined) si = false;
	  if (dp === undefined) dp = 1;
		
	  const thresh = si ? 1000 : 1024;

	  if (Math.abs(bytes) < thresh) {
	    return bytes + ' B';
	  }

	  const units = si 
	    ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
	    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	  let u = -1;
	  const r = Math.pow(10, dp);

	  do {
	    bytes /= thresh;
	    ++u;
	  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

	  return bytes.toFixed(dp) + ' ' + units[u];
	}
	
	function _addDescription(file) {
		const div = document.createElement('div');
		div.style.textAlign = "center";

		const fileName = file.name.length > 10 ? file.name.substring(0, 10) + "..." : file.name;
		const fileSize = _getHumanReadableFileSize(file.size, true);

	    div.innerHTML = fileName + "<br>" + fileSize;
	    file.previewTemplate.insertBefore(div, file.previewTemplate.querySelector(".dz-remove"));
	}
	
	function _getOptionWithDynamicSetting(option) {
		return Object.assign(option, 
			{ 
				dictDefaultMessage: _setDefaultMessage({ 
					maxFiles: option.maxFiles, 
					maxFilesize: option.maxFilesize, 
					maxFileTotalSize: option.maxFileTotalSize  
				})
			}
		)
	}
	
	function _getElements(id) {
		return {
			fileId: document.querySelector("#" + id + "_fileId"),
			valueSphere: document.querySelector("#" + id + "_value_sphere")
		}
	}
	
	function CustomDropzone(id, option) {			
		const customDropzone = CustomDropzone.get(id);
		
		if (customDropzone && option.createDropzoneHtmlAgain !== true) {
			this.initialize(customDropzone)
			return customDropzone;
		}
		
		if (customDropzone && option.createDropzoneHtmlAgain === true) {
			dropzones.splice(dropzones.findIndex(function(each) { return each.id === id }), 1)
		}

		const _option = _getOptionWithDynamicSetting(Object.assign(defaultOption, option));

		Dropzone.options[_camelize(id)] = _option;
	
		this.camelizedId = _camelize(id);

		this.id = id;
		this.option = _option;
		this.totalFiles = [];
		this.newSavedFiles = [];
		this.deletedFiles = [];

		this.dropzone = new Dropzone("#" + id);
		
		const elements = _getElements(id);
		
		this.fileId = elements.fileId && elements.fileId.value;
		this.valueSphere = elements.valueSphere && elements.valueSphere.value;
		
		dropzones.push(this);
	}
	
	CustomDropzone.prototype.initialize = function(customDropzone) {
		const _this = customDropzone || this;
		_this.dropzone.removeAllFiles();
		_this.totalFiles = [];
		_this.newSavedFiles = [];
		_this.deletedFiles = [];
		
		const elements = _getElements(_this.id);
		_this.fileId = elements.fileId && elements.fileId.value;
		_this.valueSphere = elements.valueSphere && elements.valueSphere.value;
		_displayExistingFiles.call(_this.dropzone);
	}
	
	CustomDropzone.prototype.removeAllFiles = function() {
		this.dropzone.removeAllFiles();
	}
	
	CustomDropzone.prototype.getTotalFileSize = function() {
		const totalSize = this.totalFiles.reduce(function(acc, cur) { return acc + file.size }, 0);
	}
	
	CustomDropzone.prototype.attachFileToFormData = function(formData) {
		this.newSavedFiles.forEach(function(file) { formData.append("files", file); })
		this.deletedFiles.forEach(function(file) { formData.append("deletedOrders", file.order); });
		if (this.fileId) formData.append("fileId", this.fileId);
		if (this.valueSphere) formData.append("value_sphere", this.valueSphere);
	}
	
	CustomDropzone.dropzones = dropzones;
	
	CustomDropzone.get = function(id) {
		return dropzones.find(function(dropzone) { return dropzone.id === id });
	}
	
	return CustomDropzone;
	
})();