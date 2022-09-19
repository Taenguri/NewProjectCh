/**
 * Modern Script 코드들을 사용하기 위한 스크립트 파일 입니다.
 * 내용 작성시에는 IE, Chrome, FireFox, Safari에서 전부 기능 테스트를 해주시기 바랍니다. 
 * By KUCKJWI
 */

/**
 * includes Polyfill.
 * <strong>Spec ECMAScript6</strong>
 */
if (!String.prototype.includes) {
	String.prototype.includes = function(search, start) {
		'use strict'; // 선언하지 않는 변수 선언 방지
		if (typeof start !== 'number') {
			start = 0;
		}
		
		if (search != null) {
			if (start + search.length > this.length) {
				return false;
			} else {
				return this.indexOf(search, start) !== -1;
			}
		}
	};
}

if (!Object.keys) {
	Object.keys = (function() {'use strict';
	let hasOwnProperty = Object.prototype.hasOwnProperty,
		hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
		dontEnums = [
			'toString',
			'toLocaleString',
			'valueOf',
			'hasOwnProperty',
			'isPrototypeOf',
			'propertyIsEnumerable',
			'constructor'
		],
		dontEnumsLength = dontEnums.length;

return function(obj) {``
  if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
    throw new TypeError('Object.keys called on non-object');
      }

      let result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

if(!Array.prototype.includes) {
	Array.prototype.includes = function(value) {
		return this.indexOf(value) > -1;
	}
}

/**
 * nodeList 등을 실제 배열로 반환한다.
 */
if (!Array.from) {
	  Array.from = (function () {
	    let toStr = Object.prototype.toString;
	    let isCallable = function (fn) {
	    	return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
	    };
	    let toInteger = function (value) {
	    	let number = Number(value);
	        if (isNaN(number)) { return 0; }
	        if (number === 0 || !isFinite(number)) { return number; }
	        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
	    };
	    let maxSafeInteger = Math.pow(2, 53) - 1;
	    let toLength = function (value) {
	    	let len = toInteger(value);
	    	return Math.min(Math.max(len, 0), maxSafeInteger);
	    };

	    // The length property of the from method is 1.
	    return function from(arrayLike/*, mapFn, thisArg */) {
	      // 1. Let C be the this value.
	      let C = this;

	      // 2. Let items be ToObject(arrayLike).
	      let items = Object(arrayLike);

	      // 3. ReturnIfAbrupt(items).
	      if (arrayLike == null) {
	        throw new TypeError('Array.from requires an array-like object - not null or undefined');
	      }

	      // 4. If mapfn is undefined, then let mapping be false.
	      let mapFn = arguments.length > 1 ? arguments[1] : void undefined;
	      let T;
	      if (typeof mapFn !== 'undefined') {
	        // 5. else
	        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
	        if (!isCallable(mapFn)) {
	          throw new TypeError('Array.from: when provided, the second argument must be a function');
	        }

	        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
	        if (arguments.length > 2) {
	          T = arguments[2];
	        }
	      }

	      // 10. Let lenValue be Get(items, "length").
	      // 11. Let len be ToLength(lenValue).
	      let len = toLength(items.length);

	      // 13. If IsConstructor(C) is true, then
	      // 13. a. Let A be the result of calling the [[Construct]] internal method 
	      // of C with an argument list containing the single item len.
	      // 14. a. Else, Let A be ArrayCreate(len).
		  let A = isCallable(C) ? Object(new C(len)) : new Array(len);

	      // 16. Let k be 0.
		  let k = 0;
	      // 17. Repeat, while k < len… (also steps a - h)
		  let kValue;
	      while (k < len) {
	        kValue = items[k];
	        if (mapFn) {
	          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
	        } else {
	          A[k] = kValue;
	        }
	        k += 1;
	      }
	      // 18. Let putStatus be Put(A, "length", len, true).
	      A.length = len;
	      // 20. Return A.
	      return A;
	    };
	  }());
	}

/*
 * Object.assign polyfill
 */
if (typeof Object.assign !== 'function') {
	  // Must be writable: true, enumerable: false, configurable: true
	  Object.defineProperty(Object, "assign", {
	    value: function assign(target, varArgs) { // .length of function is 2
	      'use strict';
	      if (target === null || target === undefined) {
	        throw new TypeError('Cannot convert undefined or null to object');
	      }

	      let to = Object(target);

	      for (let index = 1; index < arguments.length; index++) {
	        let nextSource = arguments[index];

	        if (nextSource !== null && nextSource !== undefined) { 
	          for (let nextKey in nextSource) {
	            // Avoid bugs when hasOwnProperty is shadowed
	            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
	              to[nextKey] = nextSource[nextKey];
	            }
	          }
	        }
	      }
	      return to;
	    },
	    writable: true,
	    configurable: true
	  });
	}

if (!Object.entries) {
	  Object.entries = function( obj ){
	    let ownProps = Object.keys( obj ),
	        i = ownProps.length,
	        resArray = new Array(i); // preallocate the Array
	    while (i--)
	      resArray[i] = [ownProps[i], obj[ownProps[i]]];
	    
	    return resArray;
	  };
	}

if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      let o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      let len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      let thisArg = arguments[1];

      // 5. Let k be 0.
      let k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        let kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    },
    configurable: true,
    writable: true
  });
}

//https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw TypeError('"this" is null or not defined');
      }

      let o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      let len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      let thisArg = arguments[1];

      // 5. Let k be 0.
      let k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        let kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
    configurable: true,
    writable: true
  });
}

if (!Number.isFinite) {
	Number.isFinite = function(value) {
	    return typeof value === 'number' && isFinite(value);
	}
}

if (!Number.isInteger) {
	Number.isInteger = function(value) {
	  return typeof value === 'number' && 
	    isFinite(value) && 
	    Math.floor(value) === value;
	};
}