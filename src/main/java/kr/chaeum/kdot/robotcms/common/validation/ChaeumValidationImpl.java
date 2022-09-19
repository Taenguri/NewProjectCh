package kr.chaeum.kdot.robotcms.common.validation;

import kr.chaeum.kdot.robotcms.common.message.ResultCode;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.lang.reflect.Array;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ChaeumValidationImpl extends EgovAbstractServiceImpl implements ChaeumValidation {
    private static final String TRANS_KEY_INJECT_PATTERN;
    private static final Locale SYSTEM_LOCALE;

    static {
        TRANS_KEY_INJECT_PATTERN = "[^0-9,^,]";
        SYSTEM_LOCALE = Locale.KOREA;
    }

    @Override
    public Map<String, Object> nullValidation(Map<String, Object> map) {
        Set<Map.Entry<String, Object>> set = map.entrySet();
        for (Map.Entry<String, Object> e : set) {
            map.put(e.getKey(), e.getValue() == null ? "" : e.getValue());
        }
        return map;
    }

    @Override
    public boolean dateTypeCheck(String type, String date) {
        SimpleDateFormat sdf = new SimpleDateFormat(type, SYSTEM_LOCALE);
        sdf.setLenient(false);
        try {
            sdf.parse(date);
        } catch (ParseException e) {
            return false;
        }
        return true;
    }

    @Override
    public boolean isInputCheck(String type, String value) {
        boolean flag = false;
        String pattern;
        // 숫자
        if(type.equalsIgnoreCase("NUMBER")) {
            pattern = "^[0-9]*$";
            flag = Pattern.matches(pattern, value);
        }
        // 영문
        else if(type.equalsIgnoreCase("ENGLISH")) {
            pattern = "^[a-zA-Z]*$";
            flag = Pattern.matches(pattern, value);
        }
        // 한글
        else if(type.equalsIgnoreCase("HANGLE")) {
            pattern = "^[ㄱ-ㅎㅏ-ㅣ가-힣]*$";
            flag = Pattern.matches(pattern, value);
        }
        // 숫자, 영문
        else if(type.equalsIgnoreCase("NUMENG")) {
            pattern = "^[a-zA-Z0-9]*$";
            flag = Pattern.matches(pattern, value);
        }
        // 숫자, 한글
        else if(type.equalsIgnoreCase("NUMHAN")) {
            pattern = "^[ㄱ-ㅎㅏ-ㅣ가-힣0-9]*$";
            flag = Pattern.matches(pattern, value);
        }
        // 특수문자
        else if(type.equalsIgnoreCase("SPECIAL_CHAR")) {
            pattern = "^[0-9|a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힝]*$";
            flag = Pattern.matches(pattern, value);
        }
        // 년도
        else if(type.equalsIgnoreCase("YEAR")) {
            pattern = "^[0-9]*$";
            flag = value.length() == 4 && Pattern.matches(pattern, value);
        }
        // IP
        else if(type.equalsIgnoreCase("IP")) {
            pattern = "((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])([.](?!$)|$)){4}";
            flag = Pattern.matches(pattern, value);
        }
        return flag;
    }

    @Override
    public boolean isMapParamExistence(final Map<String, Object> map, final boolean isPut, final String... existenceKey) {
        boolean isExistence = true;
        for (String key : existenceKey) {
            if (!map.containsKey(key) || map.get(key) == null || map.get(key).toString().length() < 1) {
                isExistence = false;
                if (isPut) {
                    map.put(key, "");
                } else {
                    break;
                }
            }
        }
        return isExistence;
    }

    @Override
    public boolean isNull(Object obj) {
        if(obj != null) {
            if( obj instanceof String) {
                return obj.toString().trim().length() < 1;
            } else if ( obj instanceof Object[] ) {
                return Array.getLength(obj) == 0;
            } else if ( obj instanceof List) {
                return ((List<?>) obj).isEmpty();
            } else if ( obj instanceof Map) {
                return ((Map<?, ?>) obj).isEmpty();
            } else {
                return false;
            }
        }
        return true;
    }

    @Override
    public boolean isNotNull(Object obj) {
        return !isNull(obj);
    }

    @Override
    public boolean isEmpty(CharSequence cs) {
        return cs == null || cs.length() < 1;
    }

    @Override
    public boolean isNumeric(CharSequence cs) {
        if (isEmpty(cs)) {
            return false;
        }
        for (int i=0, len=cs.length(); i<len; i++) {
            if (!Character.isDigit(cs.charAt(i))) {
                return false;
            }
        }
        return true;
    }

    @Override
    public boolean isMobileNumber(String number) {
        if(this.isNull(number)) return false;
        String regExp = "^01(?:0|1|[6-9])[.-]?(\\d{3}|\\d{4})[.-]?(\\d{4})$";
        return number.matches(regExp);
    }

    @Override
    public Map<String, Object> validationCheckResult(Map<String, Object> checkResult) {
        Map<String, Object> resultMap = new HashMap<>(checkResult);

        if(!this.isNull(resultMap) && !this.isNull(resultMap.get(ResultCode.MSG))) {
            return this.errorResult(resultMap.get(ResultCode.MSG).toString());
        }

        resultMap.put(ResultCode.RESULT, ResultCode.SUCCESS);
        return resultMap;
    }

    @Override
    public boolean isSplitKeyValidationCheck(String splitKey) {
        return this.isPatternCheck(splitKey, TRANS_KEY_INJECT_PATTERN);
    }

    @Override
    public boolean isPatternCheck(final String data, final String pattern) {
        Pattern p = Pattern.compile(pattern);
        Matcher m = p.matcher(data.replaceAll(" ", ""));
        return m.find();
    }

    @Override
    public Map<String, Object> errorResult(String errorMsg) {
        Map<String, Object> errorResultMap = new HashMap<>();
        errorResultMap.put(ResultCode.RESULT, ResultCode.ERROR);
        errorResultMap.put(ResultCode.MSG, errorMsg);
        return errorResultMap;
    }

    @Override
    public Map<String, Object> successResult(Map<String, Object> resultData) {
        Map<String, Object> successResultMap = this.isNull(resultData) ? new HashMap<>() : resultData;
        successResultMap.put(ResultCode.RESULT, ResultCode.SUCCESS);
        return successResultMap;
    }

    @Override
    public ResponseEntity<Map<String, Object>> badRequest(final String errorMsg) {
        return ResponseEntity.badRequest().body(this.errorResult(errorMsg));
    }
}
