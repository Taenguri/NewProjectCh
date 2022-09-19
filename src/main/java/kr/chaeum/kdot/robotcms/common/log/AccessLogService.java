package kr.chaeum.kdot.robotcms.common.log;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface AccessLogService {
    void insertManagerAccessLog(String managerId, String managerAuth, boolean isPass, String failReason, String accessManagerType, HttpServletRequest request) throws Exception;

    /**
     *
     * @param userId 아이디
     * @param job 접근 업무명
     * @param accessType 접근 구분(R 단순읽기, E 엑셀반출)
     * @param request 필수
     * @throws Exception 롤백
     */
    void insertUserInfoAccessLog(String userId, String job, String accessType, HttpServletRequest request) throws Exception;
}
