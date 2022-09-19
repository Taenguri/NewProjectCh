package kr.chaeum.kdot.robotcms.common.log;

import kr.chaeum.kdot.robotcms.common.method.ChaeumMethod;
import lombok.RequiredArgsConstructor;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AccessLogServiceImpl extends EgovAbstractServiceImpl implements AccessLogService {
    private final AccessLogDAO accessLogDAO;
    private final ChaeumMethod chaeumMethod;

    @Override
    public void insertManagerAccessLog(String managerId, String managerAuth, boolean isPass, String failReason, String accessManagerType, HttpServletRequest request) throws Exception {
        Map<String, Object> insertParam = new HashMap<>();

        insertParam.put("access_ip", this.chaeumMethod.getRemoteIp(request));
        insertParam.put("access_id", managerId);
        insertParam.put("access_auth", managerAuth);
        insertParam.put("access_agent", this.chaeumMethod.getUserAgent(request));
        insertParam.put("access_pass_yn", isPass ? "Y" : "N");
        insertParam.put("access_fail_reason", failReason);
        insertParam.put("access_manager_type", accessManagerType);

        this.accessLogDAO.insertManagerAccessLog(insertParam);
    }

    @Override
    public void insertUserInfoAccessLog(String userId, String job, String accessType, HttpServletRequest request) throws Exception {
        Map<String, Object> insertParam = new HashMap<>();

        insertParam.put("worker_ip", this.chaeumMethod.getRemoteIp(request));
        insertParam.put("worker_id", this.chaeumMethod.getWorker(request));
        insertParam.put("worker_name", this.chaeumMethod.getWorkerName(request));
        insertParam.put("worker_sys", this.chaeumMethod.getSystemName("ENG"));
        insertParam.put("user_id", userId);
        insertParam.put("first_work", this.chaeumMethod.makeFirstLastWork(job, request));
        insertParam.put("access_type", accessType);

        this.accessLogDAO.insertUserInfoAccessLogLas(insertParam);
    }
}
