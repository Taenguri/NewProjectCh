const TableSort = (function() {
	const ORDER = {
		ASC: {
		   text: "ASC",
		   icon: "▲",
		   html: "<span>오름차순</span>",
		   className: "sortUp"
		},
		DESC: {
		   text: "DESC",
		   icon: "▼",
		   html : "<span>내림차순</span>",
		   className: "sortDn"
		}
	}
	
	const BUTTON_CLASS_NAME = "sortable";

	function TableSort(id, option) {
		this.table = document.getElementById(id);
		
		if (!this.table || this.table.tagName !== "TABLE") throw new Error("Invalid Table ID");
		
		this.headers = option.headers || (function() { throw new Error("Option headers is not defined") })();
		this.click = option.click || (function() { throw new Error("Option click is not defined") })();
		this.elements = [];
		this.setHeader();
	}
	
	TableSort.prototype.getElementByText = function(header) {
		return Array.from(this.table.querySelectorAll("th")).find(function(th) { 
			return th.textContent.trim() === header.name
		})
	}
	
	TableSort.prototype.createSortableElement = function(header, selector) {
		const textNode = selector.firstChild;
		//const textContent = textNode.textContent;
		
		const button = document.createElement("button");
		button.className = BUTTON_CLASS_NAME;
		selector.replaceChild(button, textNode);
		button.appendChild(textNode);
		
		return button;
	}
	
	TableSort.prototype.setEventListener = function(button, header, textContent) {
		const _this = this;
		
		this.elements.push({ tag: button, column: header.column });
		button.addEventListener("click", function(e) {
			const order = e.currentTarget.dataset.order === ORDER.ASC.text ? ORDER.DESC : ORDER.ASC;
			_this.resetHeaders(textContent);
			_this.click({ column: header.column, order: order.text, orderQuery: header.column + " " + order.text });
			e.currentTarget.innerHTML = textContent.trim() + order.html;
			e.currentTarget.setAttribute("data-order", order.text);
			e.currentTarget.className = order.className;
		});
	}
	 
	TableSort.prototype.resetHeaders = function() {
		Array.from(this.table.querySelectorAll("th")).forEach(function(th) {
			const button = th.querySelector("." + ORDER.ASC.className + ", ." + ORDER.DESC.className);

			let span;
			if (button) {
				button.className = BUTTON_CLASS_NAME;
				span = button.querySelector("span");
				if (span) button.removeChild(span);
			}
		})
	}
	
	TableSort.prototype.setHeader = function() {
		const _this = this;

		this.headers.forEach(function(header) {
			const selector = _this.getElementByText(header);
			if (!selector) throw new Error("Invalid header name: " + header.name)
			const textNode = selector.firstChild;
			const textContent = textNode.textContent;
			
			const button = _this.createSortableElement(header, selector)
			_this.setEventListener(button, header, textContent)
		})
	}
	
	TableSort.prototype.init = function(obj) {
		const target = this.elements.find(function(e) { return e.column === obj.column });
		if (!target) throw new Error("부적합한 column 명입니다.");
		target.tag.textContent = target.tag.textContent + (obj.order === ORDER.ASC.text ?  ORDER.DESC.icon : ORDER.ASC.icon);
		target.tag.click();
	}
	
	return TableSort;
	
})();