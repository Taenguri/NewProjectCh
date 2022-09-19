const Dialog = (function() {
	
	const dialogs = [];

	const JS_DIV = "jsDiv";
	const TABLE_CELL = "table-cell";
	const INNER_CELL = "inner-cell";
	
	const JS_DIV_CONTENT = "jsDivContent";
	const JS_DIV_CLOSE = "jsDivClose";
	
	const BLOCK = "block";
	const ON = "on";
	const NO_SCROLL = "no_scroll";
	const DRAGGABLE = "draggable";
	const BTN_AREA = "btnArea";
	const BTN_PRI = "btn pri";
	const BTN_NORMAL = "btn";

	const CONFIRM_TEXT = "확인";
	const CLOSE_TEXT = "닫기";
	
	const TIME_OUT = 10;

	const ERROR_MESSAGES = {
		DUPLICATE: "이미 다이얼로그가 설정된 Element Id 입니다.",
		NOT_REGISTERED: "등록되지 않은 다이얼로그 id 입니다.",
	}
	
	function Dialog(option) {
		this.id = option.id;
		this.dialogElement = document.getElementById(option.id);
		this.checkDuplicate();
		this.checkJsDiv();
		this.contentElements = this.dialogElement.children;
		
		this.title = option.title;
		this.openEvent = option.openEvent;
		this.closeEvent = option.closeEvent;
		this.buttons = option.buttons;
		this.width = option.width;
		this.height = option.height;
		this.maxWidth = option.maxWidth;
		this.maxHeight = option.maxHeight;
		this.useScroll = option.useScroll || false;
		
		this.createJsDivContent();

		this.createInnerCell();
		this.createTableCell();
		this.createButtons();
		this.createBtnClose();
		
		return this;
	}
	
	Dialog.prototype.checkDuplicate = function() {
		const _this = this

		if(dialogs.find(function(dialog) { return dialog.id === _this.id; }))
			 throw new Error(ERROR_MESSAGES.DUPLICATE);
	}
	
	Dialog.prototype.checkJsDiv = function() {
		if (!this.dialogElement.classList.contains(JS_DIV)) 
			throw new Error("해당 ID 는 " + JS_DIV + " class 를 포함하지 않습니다.")
	}
	
	Dialog.prototype.createJsDivContent = function() {
		const previousJsDivContent = this.dialogElement.querySelector("." + JS_DIV_CONTENT)

		if (previousJsDivContent) {
			this.jsDivContent = previousJsDivContent;
			return;
		}
		
		const jsDivContent = document.createElement("div");
		
		jsDivContent.className = JS_DIV_CONTENT;

		Array.from(this.contentElements).forEach(function(element) {
			jsDivContent.appendChild(element);
		})
		
		this.jsDivContent = jsDivContent;
		this.dialogElement.appendChild(jsDivContent);
	}
	
	Dialog.prototype.createInnerCell = function() {
		const prevInnerCell = this.dialogElement.querySelector("." + INNER_CELL);
		
		if (prevInnerCell) {
			this.innerCell = prevInnerCell;
			return;
		}
		
		const innerCell = document.createElement("div");
		innerCell.className = INNER_CELL;
		this.dialogElement.appendChild(innerCell);
		this.innerCell = innerCell;
		this.innerCell.appendChild(this.jsDivContent);
	}
	
	Dialog.prototype.createTableCell = function() {
		const prevTableCell = this.dialogElement.querySelector("." + TABLE_CELL);
		
		if (prevTableCell) {
			this.tableCell = prevTableCell;
			return;
		}
		
		const tableCell = document.createElement("div");
		tableCell.className = TABLE_CELL;
		this.dialogElement.appendChild(tableCell);
		this.tableCell = tableCell;
		this.tableCell.appendChild(this.innerCell);
	}
	
	Dialog.prototype.createTitle = function() {
		if (!this.title) return;

		const previousTitleElement = this.dialogElement.querySelector('h3[class="title"]');

		const text = typeof this.title === "function" ? this.title(this) : this.title;
		
		if(previousTitleElement) {
			previousTitleElement.textContent = text;
			return;
		}
		
		const title = document.createElement("h4");
		title.textContent = this.title;
		this.jsDivContent.insertAdjacentHTML("beforebegin", '<header><h3 class="title">' + text + '</h3></header>');
	}
	
	Dialog.prototype.createBtnClose = function() {
		if (this.dialogElement.querySelector("." + JS_DIV_CLOSE)) return;

		const button = document.createElement("button");
		button.className = "btn " + JS_DIV_CLOSE;
		button.textContent = CLOSE_TEXT;
		
		const _this = this;
		button.addEventListener("click", function() { _this.close(_this) });
		this.innerCell.appendChild(button);
	}
	
	Dialog.prototype.getButtonOptionBtnArea = function() {
		return Array.from(this.innerCell.children).find(function(each) { return each.classList.contains(BTN_AREA) })
	}
	
	Dialog.prototype.createButtons = function() {
		const buttonOptionBtnArea = this.getButtonOptionBtnArea();

		if (!this.buttons && buttonOptionBtnArea) return;

		_removeElement(buttonOptionBtnArea);
		_removeElement(this.dialogElement.querySelector("." + JS_DIV_CLOSE));

		const btnArea = document.createElement("div");
		
		btnArea.className = BTN_AREA;
		
		if (!this.buttons) return;

		const _this = this;

		this.buttons.forEach(function(option) {
			const button = document.createElement("button");
			button.className = option.primary === true ? BTN_PRI : BTN_NORMAL;
			button.addEventListener("click", function() { option.click(_this) });
			button.innerText = option.text;
			btnArea.appendChild(button);
		});
       this.innerCell.appendChild(btnArea);
	}
	
	Dialog.prototype.createDefaultButton = function(btnArea) {
		const button = document.createElement("button");
		
		button.className = BTN_NORMAL;
		
		const _this = this;
		
		button.addEventListener("click", this.close.bind(_this));
		button.innerText = CLOSE_TEXT;
		btnArea.appendChild(button);
		this.innerCell.appendChild(btnArea);
	}
	
	Dialog.prototype.setOption = function(option) {
		this.buttons = option.buttons || this.buttons;
		this.createButtons();
		this.openEvent = option.openEvent || this.openEvent;
		this.closeEvent = option.closeEvent || this.closeEvent;
		this.title = option.title || this.title; 
		this.width = option.width || this.width;
		this.height = option.height || this.height;
		this.maxWidth = option.maxWidth || this.maxWidth;
		this.maxHeight = option.maxHeight || this.maxHeight;
		this.useScroll = option.useScroll || this.useScroll;
		
		this.createBtnClose();
		
		return this;
	}
	
	Dialog.prototype.open = function(e) {
		if (this.width && this.width !== "auto") this.innerCell.style.width = this.width; 
		if (this.height && this.width !== "auto") this.innerCell.style.height = this.height; 
		
		this.jsDivContent.style.maxWidth = this.maxWidth;
		this.jsDivContent.style.maxHeight = this.maxHeight;
		this.dialogElement.classList.add(BLOCK);
//		this.jsDivContent.setAttribute(DRAGGABLE, true);

		if (!this.useScroll) document.body.classList.add(NO_SCROLL);

		this.invokeButton = e;
		
		if (this.openEvent) this.openEvent(this);
		
		this.createTitle();
		
		const _this = this;

		setTimeout(function() {
			_this.dialogElement.classList.add(ON);
		}, TIME_OUT);
	}

	Dialog.prototype.close = function(e) {
		this.dialogElement.classList.remove(ON);
		
		if (this.closeEvent) this.closeEvent(this);
		
		const _this = this;
				
		setTimeout(function() {
			_this.dialogElement.classList.remove(BLOCK);
			if (!_this.useScroll) document.body.classList.remove(NO_SCROLL);
//			_this.jsDivContent.setAttribute(DRAGGABLE, true);
		}, TIME_OUT);
	}
	
	Dialog.prototype.remove = function() {
		const _this = this;
		const index = dialogs.findIndex(function(each) { return _this.id === each.id });
		dialogs.splice(index, 1);
	}
	
	function _removeElement(element) {
		if(element) element.parentElement.removeChild(element);
	}
	
	function getNewInstance(option) {
		const dialog = new Dialog(option);
		
		dialogs.push(dialog);
		
		return dialog;
	}
	
	function getAll() {
		return dialogs;
	}
	
	function get(id) {
		return dialogs.find(function(dialog) { return id === dialog.id; });
	}
	
	function remove(id) {
		const dialog = get(id);
		if (!dialog) throw new Error("존재하지 않는 id 입니다.");
		const index = dialogs.findIndex(function(each) { return each.id === id })
		dialogs.splice(index, 1);
		for (let prop in dialog) delete dialog[prop];
	}
	
	return {
		New: getNewInstance,
		getAll: getAll,
		get: get,
		remove: remove
	}; 
	
})();
