package kr.chaeum.kdot.robotcms.common.method;

import kr.chaeum.kdot.robotcms.common.validation.ChaeumValidation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.StringEscapeUtils;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.jsoup.Jsoup;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChaeumMethodImpl extends EgovAbstractServiceImpl implements ChaeumMethod {
    private static final Locale SYSTEM_LOCALE;
    private static final String SYSTEM_NAME;
    private static final String SYSTEM_NAME_ENG;
    public static final int[] MONTH_NAME_VALUES;

    static {
        SYSTEM_LOCALE = Locale.KOREA;
        SYSTEM_NAME = "로봇-CMS";
        SYSTEM_NAME_ENG = "ROBOT-CMS";
        MONTH_NAME_VALUES = new int[]{Calendar.JANUARY, Calendar.FEBRUARY, Calendar.MARCH, Calendar.APRIL,
                Calendar.MAY, Calendar.JUNE, Calendar.JULY, Calendar.AUGUST,
                Calendar.SEPTEMBER, Calendar.OCTOBER, Calendar.NOVEMBER, Calendar.DECEMBER};
    }

    @Value("${server.servlet.context-path}")
    private String defaultContextPath;

    private final ChaeumValidation chaeumValidation;

    @Override
    public Map<String, Object> makeStartEndDisplay(Map<String, Object> params) {
        Map<String, Object> resultMap = new HashMap<>(params);
        int nPageNo = 1;
        int nDisplay = 10;

        if (!this.chaeumValidation.isNull(resultMap.get("pageNo"))) {
            nPageNo = Integer.parseInt(resultMap.get("pageNo").toString());
        }

        if (!this.chaeumValidation.isNull(resultMap.get("display"))) {
            nDisplay = Integer.parseInt(resultMap.get("display").toString());
        }

        int displayStart = nDisplay * (nPageNo - 1) + 1;
        int displayEnd = nDisplay * (nPageNo - 1) + nDisplay;

        resultMap.put("start_display", displayStart);
        resultMap.put("end_display", displayEnd);

        return resultMap;
    }

    @Override
    public Map<String, Object> makeStartEndDate(Map<String, Object> params) {
        Map<String, Object> resultMap = new HashMap<>(params);

        if(!this.chaeumValidation.isNull(params.get("start_date")) && this.chaeumValidation.isNull(resultMap.get("end_date"))) {
            resultMap.put("end_date", resultMap.get("start_date"));
        } else if(this.chaeumValidation.isNull(params.get("start_date")) && !this.chaeumValidation.isNull(resultMap.get("end_date"))) {
            resultMap.put("start_date", resultMap.get("end_date"));
        } else if(this.chaeumValidation.isNull(params.get("start_date")) && this.chaeumValidation.isNull(resultMap.get("end_date"))) {
            String currentDate = new SimpleDateFormat("yyyyMMdd", this.getLocale()).format(new Date());
            resultMap.put("start_date", currentDate);
            resultMap.put("end_date", currentDate);
        }

        return resultMap;
    }

    @Override
    public Map<String, Object> makeStartEndDisplayBoard(Map<String, Object> params) {
        int nPageNo = 1;
        int nDisplay = 10;
        int totalCnt = 0;

        if (!this.chaeumValidation.isNull(params.get("pageNo"))) {
            nPageNo = Integer.parseInt(params.get("pageNo").toString());
        }

        if (!this.chaeumValidation.isNull(params.get("display"))) {
            nDisplay = Integer.parseInt(params.get("display").toString());
        }

        if (!this.chaeumValidation.isNull(params.get("total_cnt"))) {
            totalCnt = Integer.parseInt(params.get("total_cnt").toString());
        }

        int displayStart = totalCnt - (nPageNo * nDisplay) + 1;

        if (displayStart < 0) {
            displayStart = 1;
        }

        int displayEnd = totalCnt - (nPageNo * nDisplay) + nDisplay;

        params.put("start_display", displayStart);
        params.put("end_display", displayEnd);

        return params;
    }

    @Override
    public String makeFirstLastWork(String work, HttpServletRequest request) {
        StringBuilder workBuff = new StringBuilder();
        workBuff.append(new SimpleDateFormat("yyyyMMdd HHmm", SYSTEM_LOCALE).format(new Date())).append(' ');
        workBuff.append(this.getWorker(request)).append('@');
        workBuff.append(this.getRemoteIp(request)).append(' ');
        workBuff.append(work);
        return workBuff.toString();
    }

    @Override
    public String getRemoteIp(HttpServletRequest request) {
        if (this.chaeumValidation.isNull(request)) return "";

        String ip = request.getHeader("X-FORWARDED-FOR");

        if (this.chaeumValidation.isNull(ip)) ip = request.getHeader("Proxy-Client-IP");
        if (this.chaeumValidation.isNull(ip)) ip = request.getHeader("WL-Proxy-Client-IP");
        if (this.chaeumValidation.isNull(ip)) ip = request.getRemoteAddr();

        return ip;
    }

    @Override
    public Locale getLocale() {
        return SYSTEM_LOCALE;
    }

    @Override
    public String getMaskedName(String name) {
        if (this.chaeumValidation.isNull(name)) return name;

        String maskedName;
        String firstName;
        String middleName;
        String lastName = "";
        int lastNameStartPoint;

        if (name.length() > 1) {
            firstName = name.substring(0, 1);
            lastNameStartPoint = name.indexOf(firstName);

            if (name.trim().length() > 2) {
                middleName = name.substring(lastNameStartPoint + 1, name.trim().length() - 1);
                lastName = name.substring(lastNameStartPoint + (name.trim().length() - 1), name.trim().length());
            } else {
                middleName = name.substring(lastNameStartPoint + 1, name.trim().length());
            }

            StringBuilder makers = new StringBuilder();

            for (int i = 0; i < middleName.length(); i++) {
                makers.append('*');
            }

            lastName = middleName.replace(middleName, makers.toString()) + lastName;
            maskedName = firstName + lastName;
        } else {
            maskedName = name;
        }

        return maskedName;
    }

    @Override
    public String getMaskedPhoneNum(String phoneNum, boolean isHyphen) {
        if (this.chaeumValidation.isNull(phoneNum)) return phoneNum;

        String regex = "(\\d{2,3})(\\d{3,4})(\\d{4})$";
        if (isHyphen) regex = "(\\d{2,3})-?(\\d{3,4})-?(\\d{4})$";

        Matcher matcher = Pattern.compile(regex).matcher(phoneNum);

        if (matcher.find()) {
            String replaceTarget = matcher.group(2);
            char[] c = new char[replaceTarget.length()];
            Arrays.fill(c, '*');
            return phoneNum.replace(replaceTarget, String.valueOf(c));
        }

        return phoneNum;
    }

    @Override
    public String makeSelectBoxOptionData(List<Map<String, Object>> codeList, String valueKey, String textKey) {
        if (this.chaeumValidation.isNull(codeList) || this.chaeumValidation.isNull(valueKey) || this.chaeumValidation.isNull(textKey))
            return null;

        StringBuilder codeBuff = new StringBuilder();
        for (Map<String, Object> codeMap : codeList) {
            codeBuff.append("<option value=\"").append(codeMap.get(valueKey)).append("\">").append(codeMap.get(textKey)).append("</option>");
        }

        return codeBuff.toString();
    }

    @Override
    public String makeSelectBoxOptionData(Object codeList) {
        if (this.chaeumValidation.isNull(codeList)) return null;
        List<Object> objList;
        if (codeList instanceof List<?>) objList = (List<Object>) codeList;
        else return null;

        StringBuilder codeBuff = new StringBuilder();
        for (Object code : objList) {
            codeBuff.append("<option value=\"").append(code).append("\">").append(code).append("</option>");
        }

        return codeBuff.toString();
    }

    @Override
    public List<Map<String, Object>> listMapSort(List<Map<String, Object>> sortList, String sortKey, boolean isAsc) {
        if (this.chaeumValidation.isNull(sortList)) return sortList;

        sortList.sort(Comparator.comparing(o -> o.get(sortKey).toString()));

        if (!isAsc) Collections.reverse(sortList);

        return sortList;
    }

    @Override
    public String getUserAgent(HttpServletRequest request) {
        return request.getHeader("user-agent");
    }

    @Override
    public String removeHtmlTag(final String source) {
        if (this.chaeumValidation.isNull(source)) return source;
        return Jsoup.parse(source).text();
    }

    @Override
    public String numberWithComma(final long num) {
        return NumberFormat.getInstance().format(num);
    }

    @Override
    public List<String> getMapInListString(Map<String, Object> dataMap, String key) {
        if (this.chaeumValidation.isNull(dataMap.get(key))) return null;

        List<String> resultList = new ArrayList<>();
        if (dataMap.get(key) instanceof List<?>) {
            List<?> list = (List<?>) dataMap.get(key);
            for (Object data : list) resultList.add((String) data);
        }

        return resultList;
    }

    @Override
    public String unescapeHtmlToString(final Object value) {
        String temp = value == null ? "" : value.toString();
        if (temp.length() > 0) {
            temp = StringEscapeUtils.unescapeHtml4(temp);
        }
        return temp;
    }

    @Override
    public String getWorker(HttpServletRequest request) {
        return request.getSession().getAttribute("_MANAGER_ID_") != null
                ? request.getSession().getAttribute("_MANAGER_ID_").toString() : null;
    }

    @Override
    public String getWorkerAuth(HttpServletRequest request) {
        return request.getSession().getAttribute("_MANAGER_AUTH_") != null
                ? request.getSession().getAttribute("_MANAGER_AUTH_").toString() : "NONE";
    }

    @Override
    public String getWorkerName(HttpServletRequest request) {
        return request.getSession().getAttribute("_MANAGER_NAME_") != null
                ? request.getSession().getAttribute("_MANAGER_NAME_").toString() : null;
    }

    @Override
    public String getDefaultContextPath() {
        return this.defaultContextPath;
    }

    @Override
    public String getSystemName(final String type) {
        return "KOR".equals(type) ? SYSTEM_NAME : SYSTEM_NAME_ENG;
    }

    @Override
    public String getCurrencyCode() {
        if(Locale.KOREA.equals(this.getLocale())) return "\\";
        else if(Locale.US.equals(this.getLocale())) return "$";
        return "\\";
    }

    @Override
    public Long dateCalc(String startDate) {
        try {
            Calendar getToday = Calendar.getInstance();
            getToday.setTime(new Date());

            Date date = new SimpleDateFormat("yyyyMMdd").parse(startDate.replaceAll("[^0-9]", ""));
            Calendar cmpDate = Calendar.getInstance();
            cmpDate.setTime(date);

            long diffSec = (getToday.getTimeInMillis() - cmpDate.getTimeInMillis()) / 1000;
            return diffSec / (24 * 60 * 60);
        } catch (ParseException e) {
            log.error("DATE CALC PARSE ERROR : ", e);
            return null;
        }
    }

    @Override
    public String dateCalc(int day, boolean isBefore, String returnDateFormat) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.add(Calendar.DATE, isBefore ? -day : day);
        return new SimpleDateFormat(returnDateFormat, this.getLocale()).format(cal.getTime());
    }
}
