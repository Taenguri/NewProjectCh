package kr.chaeum.kdot.robotcms.example;

import kr.chaeum.kdot.robotcms.common.message.ResultCode;
import kr.chaeum.kdot.robotcms.common.validation.ChaeumValidation;
import lombok.RequiredArgsConstructor;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExampleServiceImpl extends EgovAbstractServiceImpl implements ExampleService {
    private final ChaeumValidation chaeumValidation;

    @Override
    public Map<String, Object> example() {
        Map<String, Object> data = new HashMap<>();
        data.put("test", "example");

        if(this.chaeumValidation.isNull(data)) {
            return this.chaeumValidation.errorResult("데이터가 널입니다.");
        }

        return this.chaeumValidation.successResult(data);
    }

    public void insert() {
        exampleTransaction(null, "INSERT");
    }
    public void update() {
        exampleTransaction(null, "UPDATE");
    }

    private void exampleTransaction(Map<String, Object> params, String type) {
        Map<String, Object> resultMap = this.validationCheck(params, "INSERT");
        if(ResultCode.ERROR.equals(resultMap.get(ResultCode.RESULT))) return;

        Map<String, Object> conditionParam = new HashMap<>();
        // 삭제
        if("DELETE".equals(type)) {
            conditionParam.put("key", "");

        } else {
            conditionParam.put("content", "");

            if("UPDATE".equals(type)) {
                conditionParam.put("key", "");
                // 업데이트
            } else {
                // 입력
            }
        }



        this.chaeumValidation.successResult(null);
    }

    private Map<String, Object> validationCheck(Map<String, Object> params, String type) {
        if(!"DELETE".equals(type) && this.chaeumValidation.isNull(params.get("test"))) {
            return this.chaeumValidation.errorResult("테스트가 없습니다. ");
        }

        return this.chaeumValidation.successResult(null);
    }
}
