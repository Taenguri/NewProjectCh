/*
 * datepicker.js
 * default 세팅, autoSetup, all, get 기능 추가
 * https://github.com/qodesmith/datepicker
 */
const DatePicker = (function() {
  const DATE_PICKER_CLASS_SELECTOR = ".datepicker";

  const datepickers = [];

  const defaultOption = {
   customDays: ['일','월', '화', '수', '목', '금', '토'],
   customMonths: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
   formatter: function(input, date, instance) {
    const parsedDate = DatePicker.getParsedDate(date);
    input.value = parsedDate.year + '-' + parsedDate.month + '-' + parsedDate.day
   },
   onSelect: function (instance, date) {
	   const datepickersById = datepickers.filter(function(each) { return each.id === instance.id });
	  
	   if (datepickersById.length === 2) {
		   const elStartDate = datepickersById[0].el;
		   const elEndDate = datepickersById[1].el;
		   
		   const startDate = new Date(elStartDate.value);
		   const endDate = new Date(elEndDate.value);
		   
		   if (startDate > endDate) elEndDate.value = elStartDate.value;
	   }
     }
  }
  
  function _isValidDate(date) {
	  return (
	    _type(date) === '[object Date]' &&
	    date.toString() !== 'Invalid Date'
	  )
   }
	
  function _type(thing) {
	  return ({}).toString.call(thing)
   }
  
  function _createButton(selector, datepicker) {
	  const calendarIcon = document.createElement("button");
	  calendarIcon.type = "button";
	  calendarIcon.textContent = "달력선택";
	  calendarIcon.className = "calendar"
	  calendarIcon.addEventListener("click", function(e) { 
		 setTimeout(function() { datepicker.show(); }, 0);
	  })
	  selector.parentElement.insertBefore(calendarIcon, selector.nextSibling);
  }
  
  function _isBackSpace(e) {
	  return e.keyCode === 8;
  }
  
  function _isTab(e) {
	  return e.keyCode === 9;
  }

  function _isKeyCodeNumber(e) {
	  return ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105));
  }
  
  function _isCompletedDateType(e) {
	  return e.keyCode !== 8 && e.target.value.length >= 10;
  }
  
  function _isTextHightighted() {
	  return !!window.getSelection().toString()
  }

  const selectorEvent = {
	onKeyUp: function(e) {
	  const value = e.target.value;
	  e.target.value = value.replace(/[^0-9/-]+/g, "");
	  if (value.length === 4 || value.length === 7) e.target.value += "-";
	},
	onKeyDown: function(e) {
	  if (
		  !_isBackSpace(e) && 
		  !_isTab(e) &&
		  !_isTextHightighted() &&
		  (!_isKeyCodeNumber(e) || _isCompletedDateType(e))
		 ) 
		  e.preventDefault();
	},
	onFocusOut: function(e) {
	  if (e.target.value.length !== 10 || !_isValidDate(new Date(e.target.value))) e.target.value = "";
	}
  }

  function DatePicker(selector, option) {
    this.selector = document.querySelector(selector);
    
    if (!this.selector) throw new Error("Invalid selector!");
    
    this.selector.setAttribute("autocomplete", "off");
    this.selector.setAttribute("placeholder", "YYYY-MM-DD");
    
    this.selector.addEventListener("keydown", selectorEvent.onKeyDown);
    this.selector.addEventListener("keyup", selectorEvent.onKeyUp);
    this.selector.addEventListener("focusout", selectorEvent.onFocusOut);
    
    this.option = Object.assign(defaultOption, option);
    const _datepicker = datepicker(selector, this.option)
    datepickers.push(_datepicker);
    _createButton(this.selector, _datepicker);
    return _datepicker
  }


  DatePicker.autoSetup = function() {
    Array.from(document.querySelectorAll(DATE_PICKER_CLASS_SELECTOR)).forEach(function(element) {
      if (!element.id) throw new Error("every datepickers must have id attribute");
      datepickers.push(new DatePicker('#' + element.id, defaultOption));   
    })
  }

  DatePicker.all = function() {
    return datepickers;
  }

  DatePicker.get = function(selector) {
    return datepickers.find(function(datepicker) {
      return datepicker.el === document.querySelector(selector);
    })
  }

  DatePicker.getParsedDate = function(date) {
    const selectedDate = new Date(date);
    const year = selectedDate.getFullYear();
    const month = '' + (selectedDate.getMonth() + 1);
    const day = '' + selectedDate.getDate();

    return {
      year: year,
      month: month.length < 2 ? '0' + month : month,
      day: day.length < 2 ? '0' + day : day
    }
  }
  
  DatePicker.clear = function() {
	 datepickers.forEach(function(each) { each.remove(); })
	 datepickers.splice(0, datepickers.length)
  }

  return DatePicker;
  
})()