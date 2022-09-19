package kr.chaeum.kdot.robotcms.common.excel;

import kr.chaeum.kdot.robotcms.common.validation.ChaeumValidation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.ResultContext;
import org.apache.ibatis.session.ResultHandler;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.*;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class ExcelExportServiceImpl extends EgovAbstractServiceImpl implements ExcelExportService {
    private static final String EXTENSION;
    private static final String ENCODE_TYPE;

    static {
        EXTENSION = ".xlsx";
        ENCODE_TYPE = "UTF-8";
    }

    private final SqlSessionTemplate sqlSession;
    private final ChaeumValidation chaeumValidation;

    @Override
    public void getSqlResultExcelFile(final Map<String, Object> params, final String sqlId, final String fileName, final String sheetName, final String[] colNames, final String[] dataKeys, HttpServletResponse response) throws Exception {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet(sheetName);
        String today = new SimpleDateFormat("yyyyMMddHHmm", Locale.KOREA).format(new Date());
        String excelFileName = URLEncoder.encode(fileName + "_" + today + EXTENSION, ENCODE_TYPE);
        XSSFFont font = workbook.createFont();
        font.setBold(true);

        final CellStyle headStyle = workbook.createCellStyle();
        headStyle.setFont(font);
        headStyle.setBorderTop(BorderStyle.THIN);
        headStyle.setBorderBottom(BorderStyle.THIN);
        headStyle.setBorderLeft(BorderStyle.THIN);
        headStyle.setBorderRight(BorderStyle.THIN);
        headStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.GREY_25_PERCENT.getIndex());
        headStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headStyle.setAlignment(HorizontalAlignment.CENTER);

        final CellStyle bodyStyle = workbook.createCellStyle();
        bodyStyle.setBorderTop(BorderStyle.THIN);
        bodyStyle.setBorderBottom(BorderStyle.THIN);
        bodyStyle.setBorderLeft(BorderStyle.THIN);
        bodyStyle.setBorderRight(BorderStyle.THIN);

        final CellStyle errorStyle = workbook.createCellStyle();
        errorStyle.setBorderTop(BorderStyle.THIN);
        errorStyle.setBorderBottom(BorderStyle.THIN);
        errorStyle.setBorderLeft(BorderStyle.THIN);
        errorStyle.setBorderRight(BorderStyle.THIN);
        errorStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.RED.getIndex());
        errorStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        XSSFRow row = sheet.createRow(0);
        XSSFCell cell;
        int colCnt = 0;

        cell = row.createCell(0);
        cell.setCellStyle(headStyle);
        cell.setCellValue(fileName);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, colNames.length - 1));

        row = sheet.createRow(1);
        for(String colName : colNames) {
            cell = row.createCell(colCnt++);
            cell.setCellStyle(headStyle);
            cell.setCellValue(colName);
        }

        try {
            this.sqlSession.select(sqlId, params, new ResultHandler<Map<String, Object>>() {
                @Override
                public void handleResult(ResultContext<? extends Map<String, Object>> resultContext) {
                    Map<String, Object> dataMap = resultContext.getResultObject();
                    XSSFRow row = sheet.createRow(resultContext.getResultCount() + 1);
                    XSSFCell cell;
                    int cellIdx = 0;

                    for(String key : dataKeys) {
                        cell = row.createCell(cellIdx++);
                        String cellData = chaeumValidation.isNull(dataMap.get(key)) ? "" : dataMap.get(key).toString();

                        try {
                            if(StringUtils.isNumeric(cellData) && !ExcelExportEnum.isNumIgnore(key)) cell.setCellValue(Long.parseLong(cellData));
                            else cell.setCellValue(cellData);

                            cell.setCellStyle(bodyStyle);
                        } catch (Exception e) {
                            log.error("MAKE EXCEL ERROR : ", e);
                            log.error("MAKE EXCEL ERROR >> KEY : " + key + ", DATA : " + dataMap);
                            cell.setCellValue(cellData);
                            cell.setCellStyle(errorStyle);
                        }
                    }
                }
            });

            for(int i = 0; i < colNames.length; i++) {
                sheet.autoSizeColumn(i);
                sheet.setColumnWidth(i, sheet.getColumnWidth(i) * 17/10);
            }

            response.setHeader("Set-Cookie", "fileDownload=true; path=/");
            response.setHeader("Content-Disposition", "attachment; filename=" + excelFileName);

            workbook.write(response.getOutputStream());
        } catch (Exception e) {
            log.error("SQL RESULT EXCEL ERROR : ", e);
            response.setHeader("Set-Cookie", "fileDownload=false; path=/");
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("Content-Type","text/html; charset=utf-8");
        } finally {
            workbook.close();
        }
    }
}
