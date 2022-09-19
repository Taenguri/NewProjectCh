package kr.chaeum.kdot.robotcms.common.log;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class AccessLogDAO extends EgovAbstractMapper {
    private static final String NAME_SPACE = "ACC_LOG.";

    public void insertManagerAccessLog(Map<String, Object> params) {
        insert(NAME_SPACE + "INSERT_MANAGER_ACCESS_LOG", params);
    }

    public void insertUserInfoAccessLogLas(Map<String, Object> params) {
        insert(NAME_SPACE + "INSERT_USER_INFO_ACCESS_LOG_LAS", params);
    }
}
