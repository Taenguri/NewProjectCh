package kr.chaeum.kdot.robotcms.common.message;

public class ResultCode {
    public static final String RESULT;
    public static final String RESULT_CODE;
    public static final String MSG;
    public static final String SUCCESS;
    public static final String ERROR;
    public static final String EXPIRED;

    static {
        RESULT = "result";
        RESULT_CODE = "result_code";
        MSG = "msg";
        SUCCESS = "success";
        ERROR = "error";
        EXPIRED = "expired";
    }
}
