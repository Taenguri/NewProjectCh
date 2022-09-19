package kr.chaeum.kdot.robotcms.common.validation;

import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface ChaeumValidation {
    /**
     * map 안에 있는 null요소들을 ""으로 변환 (NullPointException 방지)
     *
     * @param map
     * @return map - 널처리가 된 HashMap 요소
     */
    Map<String, Object> nullValidation(Map<String, Object> map);

    /**
     * date 타입을 체크한다.
     *
     * @param type - 날짜 포맷
     * @param date - String 형식의 날짜 값
     * @return true(성공), false(실패)
     */
    boolean dateTypeCheck(String type, String date);

    /**
     * 각 정규식을 통하여 요소의 형식을 체크한다.
     *
     * @param type
     * number - 숫자, engilsh - 영어, hangle - 한글
     * numeng - 숫자 영문, numhan - 숫자 한글, special_char - 특수문자
     * @param value - 검사할 값
     * @return true(성공), false(실패)
     */
    boolean isInputCheck(String type, String value);

    /**
     * 해당 키가 Map 요소에 존재하는지 여부를 확인한다.
     *
     * @param map
     * @param isPut (없으면 공백으로 put 시킬지 여부)
     * @param existenceKey (일반 String 및 배열 String)
     * @return isExistence (true/false)
     */
    boolean isMapParamExistence(final Map<String, Object> map, final boolean isPut, final String... existenceKey);

    /**
     * null 값인지 공백인지 여부를 확인한다.
     *
     * @param obj
     * @return true/false
     */
    boolean isNull(Object obj);

    /**
     * null이나 공백이 아닌지 판단한다.
     *
     * @param obj
     * @return true/false
     */
    boolean isNotNull(Object obj);

    /**
     * 요소에 값이 널 및 공백인지를 확인한다.
     *
     * @param cs CharSequence
     * @return true/false
     */
    boolean isEmpty(CharSequence cs);

    /**
     * 요소의값이 숫자인지 확인한다.
     *
     * @param cs CharSequence
     * @return true/false
     */
    boolean isNumeric(CharSequence cs);

    boolean isMobileNumber(String number);

    Map<String, Object> validationCheckResult(Map<String, Object> checkResult);

    boolean isPatternCheck(final String data, final String pattern);

    boolean isSplitKeyValidationCheck(final String splitKey);

    Map<String, Object> errorResult(String errorMsg);

    Map<String, Object> successResult(Map<String, Object> resultData);

    ResponseEntity<Map<String, Object>> badRequest(String errorMsg);
}
