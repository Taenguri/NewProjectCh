package kr.chaeum.kdot.robotcms.common.method;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public interface ChaeumMethod {
    Map<String, Object> makeStartEndDisplay(Map<String, Object> params);

    Map<String, Object> makeStartEndDate(Map<String, Object> params);

    //rnum 역순정렬을 위한 페이징
    Map<String, Object> makeStartEndDisplayBoard(Map<String, Object> params);

    String makeFirstLastWork(String work, HttpServletRequest request);

    String getRemoteIp(HttpServletRequest request);

    /**
     *
     * @param type 시스템명 KOR / ENG
     * @return 한글/영문 시스템명
     */
    String getSystemName(String type);

    Locale getLocale();

    String getMaskedName(String name);

    String getMaskedPhoneNum(String phoneNum, boolean isHyphen);

    String makeSelectBoxOptionData(List<Map<String, Object>> codeList, String valueKey, String textKey);

    String makeSelectBoxOptionData(Object codeList);

    List<Map<String, Object>> listMapSort(List<Map<String, Object>> sortList, String sortKey, boolean isAsc);

    String getUserAgent(HttpServletRequest request);

    String removeHtmlTag(final String source);

    String numberWithComma(final long num);

    List<String> getMapInListString(Map<String, Object> dataMap, String key);

    //html tag 변환
    String unescapeHtmlToString(final Object value);

    String getWorker(HttpServletRequest request);

    String getWorkerAuth(HttpServletRequest request);

    String getWorkerName(HttpServletRequest request);

    String getDefaultContextPath();

    String getCurrencyCode();

    Long dateCalc(String startDate);

    String dateCalc(int day, boolean isBefore, String returnDateFormat);
}
