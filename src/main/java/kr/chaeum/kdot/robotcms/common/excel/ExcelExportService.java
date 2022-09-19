package kr.chaeum.kdot.robotcms.common.excel;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;

public interface ExcelExportService {
    void getSqlResultExcelFile(final Map<String, Object> params, final String sqlId, final String fileName, final String sheetName, final String[] colNames, final String[] dataKeys, HttpServletResponse response) throws Exception;
}
