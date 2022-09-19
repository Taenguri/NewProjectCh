package kr.chaeum.kdot.robotcms.common.excel;

import java.util.Arrays;

public enum ExcelExportEnum {
    ISBN,
    CATE_CODE,
    ZIPCODE,
    LIB_CODE,
    USER_NO,
    REQ_USER_NO;

    private static String[] NUMBER_IGNORE_KEYS;

    public static String[] getNumberIgnoreKeys(Class<? extends Enum<?>> e) {
        return Arrays.stream(e.getEnumConstants()).map(Enum::name).toArray(String[]::new);
    }

    public static boolean isNumIgnore(String key) {
        if(key == null || "".equals(key)) return false;

        if(NUMBER_IGNORE_KEYS == null || NUMBER_IGNORE_KEYS.length == 0) NUMBER_IGNORE_KEYS = getNumberIgnoreKeys(ExcelExportEnum.class);

        for(String ignoreKey : NUMBER_IGNORE_KEYS) {
            if(key.contains(ignoreKey)) return true;
        }
        return false;
    }
}
