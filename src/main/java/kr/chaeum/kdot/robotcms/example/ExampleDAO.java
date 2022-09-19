package kr.chaeum.kdot.robotcms.example;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;
import org.springframework.stereotype.Repository;

@Repository
public class ExampleDAO extends EgovAbstractMapper {

    public String getTest() {
        return selectOne("");
    }
}
