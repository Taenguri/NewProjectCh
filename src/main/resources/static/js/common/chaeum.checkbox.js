/**
 * 체크박스 관리를 위한 생성자 이다.
 * 
 * @param checkBoxName1 - 전체 체크박스 name
 * @param checkBoxName2 - 자식 체크박스 name
 */
function CheckBoxMng(checkBoxName1, checkBoxName2) {
	this.checkBox1    = document.getElementsByName(checkBoxName1)[0];
	this.checkBox2    = document.getElementsByName(checkBoxName2);
}
/**
 * 적용되어있는 체크박스의 이벤트를 제거한다.
 */
CheckBoxMng.prototype.eventUnbind = function() {
	this.checkBox1.unbind();
	this.checkBox2.unbind();
}
/**
 * 체크된 체크박스의 값을 ,단위로 가져온다
 */
CheckBoxMng.prototype.getCheckingValue = function() {
	let checkBox = this.checkBox2;
	let array = [];
	Array.from(checkBox).forEach(function(each){
		if( each.checked ) {
			array.push(each.value);
		}
	});
	return array.join(",");
}
/**
 * 체크된 체크박스이 카운트를 가져온다.
 */
CheckBoxMng.prototype.getCheckingCount = function() {
	let checkBox = this.checkBox2;
	let count = 0;
	Array.from(checkBox).forEach(function(each){
		if( each.checked ) {
			count++;
		}
	});
	return count;
}

/**
 * 전체 선택
 */
CheckBoxMng.prototype.checkBoxAllCheck = function() {
	let checkBox1 = this.checkBox1;
	let checkBox2 = this.checkBox2;
	checkBox1.addEventListener("click", function() {
		if( this.checked ) {
			Array.from(checkBox2).forEach(function(each) {
				each.checked = true;
			})
		} else {
			Array.from(checkBox2).forEach(function(each) {
				each.checked = false;
			})
		}
	});
}

CheckBoxMng.prototype.checkBoxAllUnCheck = function() {
	this.checkBox1.checked = false
	Array.from(this.checkBox2).forEach(function(each) {
		each.checked = false;
	});
}

/**
 * 자식요소의 체크박스가 모두 선택되면 자동으로 부모요소의 체크박스를 선택한다.
 */
CheckBoxMng.prototype.checkingStatus = function() {
	let checkBox1 = this.checkBox1;
	let checkBox2 = this.checkBox2;
	Array.from(checkBox2).forEach(function(each){
		each.addEventListener("click", function() {
			let checkBoxCount = checkBox2.length;
			let checkCount = 0;
			
			Array.from(checkBox2).forEach(function(e){
				if( e.checked ) {
					checkCount++;
				}
			});

			checkBox1.checked = checkBoxCount === checkCount;
		});
	});
}