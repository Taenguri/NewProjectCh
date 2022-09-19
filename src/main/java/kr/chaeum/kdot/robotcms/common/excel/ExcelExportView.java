package kr.chaeum.kdot.robotcms.common.excel;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.web.servlet.view.document.AbstractXlsxView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class ExcelExportView extends AbstractXlsxView {
    private static final String EXTENSION;
    private static final String ENCODE_TYPE;
    private static final String SITE_NAME;
    private static final Locale KR_LOCALE;

    static {
        EXTENSION = ".xlsx";
        ENCODE_TYPE = "UTF-8";
        SITE_NAME = "꿈샘CMS";
        KR_LOCALE = Locale.KOREA;
    }

    @SuppressWarnings("unchecked")
    @Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
        Sheet sheet = null;
        String fileName;
        String today = new SimpleDateFormat("yyyyMMddHHmm", KR_LOCALE).format(new Date());
        Font font = workbook.createFont();
        font.setBold(true);

        final CellStyle styleHead = workbook.createCellStyle();
        styleHead.setFont(font);
        styleHead.setBorderTop(BorderStyle.THIN);
        styleHead.setBorderBottom(BorderStyle.THIN);
        styleHead.setBorderLeft(BorderStyle.THIN);
        styleHead.setBorderRight(BorderStyle.THIN);
        styleHead.setFillForegroundColor(HSSFColor.HSSFColorPredefined.GREY_25_PERCENT.getIndex());
        styleHead.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        styleHead.setAlignment(HorizontalAlignment.CENTER);
        styleHead.setVerticalAlignment(VerticalAlignment.CENTER);

        final CellStyle bodyStyle = workbook.createCellStyle();
        bodyStyle.setBorderTop(BorderStyle.THIN);
        bodyStyle.setBorderBottom(BorderStyle.THIN);
        bodyStyle.setBorderLeft(BorderStyle.THIN);
        bodyStyle.setBorderRight(BorderStyle.THIN);

        if(model.get("excel_export_info") != null) {
            Map<String, Object> exportInfo = (Map<String, Object>) model.get("excel_export_info");
            fileName = exportInfo.get("file_name") == null ? SITE_NAME : exportInfo.get("file_name").toString();
            if(!"Y".equals(exportInfo.get("multi_sheet_yn"))) sheet = workbook.createSheet(SITE_NAME + "_" + fileName);
            String uriFileName = URLEncoder.encode(SITE_NAME + "_" + fileName + "_" + today + EXTENSION, ENCODE_TYPE);
            response.setHeader("Content-disposition", "attachment; filename=" + uriFileName);

            // 통계에서 엑셀 산출 시에 헤더가 2줄 들어가는 요구사항 발생하여 분기처리함
            String[] colNames = (String[]) exportInfo.get("columns");
            String[] keys = (String[]) exportInfo.get("keys");
            Map<String, Object> searchCondition = (Map<String, Object>) exportInfo.get("search_condition");
            String titleDesc = exportInfo.get("title_desc") == null ? "" : exportInfo.get("title_desc").toString();

            if(exportInfo.get("division_columns") != null) {
                String[] divisionColumns = (String[]) exportInfo.get("division_columns");
                this.excelExportStatisticsInfoData(exportInfo, sheet, styleHead, bodyStyle, colNames, keys, divisionColumns, fileName, titleDesc, searchCondition);
            } else if("Y".equals(exportInfo.get("multi_sheet_yn"))) {
                this.excelExportMultiSheetData(exportInfo, workbook, styleHead, bodyStyle, colNames, keys, fileName, titleDesc, searchCondition);
            } else {
                List<Map<String, Object>> dataList = (List<Map<String, Object>>) exportInfo.get("data_list");
                this.excelExportListData(dataList, sheet, styleHead, bodyStyle, colNames, keys, fileName, titleDesc, searchCondition);
            }
        }
    }

    private void excelExportListData(List<Map<String, Object>> dataList, Sheet sheet, CellStyle styleHead, CellStyle styleBody, String[] colNames, String[] keys, String title, String titleDesc, Map<String, Object> searchCondition) throws Exception {
        Row row;
        Cell cell;
        int r = 0;
        int c = 0;

        // EXCEL TITLE HEADER
        if(!"".equals(titleDesc)) {
            row = sheet.createRow(r++);
            cell = row.createCell(0);
            cell.setCellValue(titleDesc);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, colNames.length - 1));
        }

        String excelTitle = title;
        if(searchCondition != null && searchCondition.get("start_date") != null) {
            excelTitle += "(" + searchCondition.get("start_date") + " ~ " + searchCondition.get("end_date") + ")";
        }

        row = sheet.createRow(r++);
        cell = row.createCell(0);
        cell.setCellValue(excelTitle);
        cell.setCellStyle(styleHead);
        sheet.addMergedRegion(new CellRangeAddress(r - 1, r - 1, 0, colNames.length - 1));

        // EXCEL HEADER
        row = sheet.createRow(r++);
        for(String colName : colNames) {
            cell = row.createCell(c++);
            cell.setCellValue(colName);
            cell.setCellStyle(styleHead);
        }

        for(Map<String, Object> dataMap : dataList) {
            row = sheet.createRow(r++);
            c = 0;

            for(String key : keys) {
                String str = "";

                if(dataMap.get(key) != null) str = dataMap.get(key).toString();

                cell = row.createCell(c++);

                if(StringUtils.isNumeric(str) && !ExcelExportEnum.isNumIgnore(key)) cell.setCellValue(!"".equals(str) ? Long.parseLong(str) : 0);
                else cell.setCellValue(str);
                cell.setCellStyle(styleBody);
            }
        }

        for(int i = 0; i < colNames.length; i++) {
            sheet.autoSizeColumn(i);
            sheet.setColumnWidth(i, sheet.getColumnWidth(i) * 17/10);
        }
    }

    @SuppressWarnings("unchecked")
    private void excelExportStatisticsInfoData(Map<String, Object> statInfo, Sheet sheet, CellStyle styleHead, CellStyle styleBody, String[] colNames, String[] keys, String[] divisionColumns, String title, String titleDesc, Map<String, Object> searchCondition) throws Exception {
        Row row;
        Cell cell;
        int r = 0;
        int c = 0;

        // EXCEL TITLE HEADER
        if(!"".equals(titleDesc)) {
            row = sheet.createRow(r++);
            cell = row.createCell(0);
            cell.setCellValue(titleDesc);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, (colNames.length - 1) * 2));
        }

        String excelTitle = title;
        if(searchCondition != null && searchCondition.get("start_date") != null) {
            excelTitle += "(" + searchCondition.get("start_date") + " ~ " + searchCondition.get("end_date") + ")";
        }

        row = sheet.createRow(r++);
        cell = row.createCell(0);
        cell.setCellValue(excelTitle);
        cell.setCellStyle(styleHead);
        sheet.addMergedRegion(new CellRangeAddress(r - 1, r - 1, 0, (colNames.length - 1) * 2));

        // EXCEL HEADER
        row = sheet.createRow(r++);
        for(String colName : colNames) {
            cell = row.createCell(c);
            cell.setCellValue(colName);
            cell.setCellStyle(styleHead);
            if(c == 0) c++;
            else {
                c++;
                cell = row.createCell(c);
                cell.setCellStyle(styleHead);
                c++;
            }
        }

        row = sheet.createRow(r++);
        c = 1;
        for(int i = 0; i < colNames.length - 1; i++) {
            for(String divisionColumn : divisionColumns) {
                cell = row.createCell(c++);
                cell.setCellValue(divisionColumn);
                cell.setCellStyle(styleHead);
            }
        }

        int firstRow = 1;
        int lastRow = 2;

        if(!"".equals(titleDesc)) {
            firstRow++;
            lastRow++;
        }

        sheet.addMergedRegion(new CellRangeAddress(firstRow, lastRow, 0,0));

        int cellLength = (colNames.length - 1) * 2;
        for(int i = 1; i < cellLength; i = i + 2) {
            sheet.addMergedRegion(new CellRangeAddress(firstRow, lastRow - 1, i, i + 1));
        }

        List<Map<String, Object>> reqStatList = (List<Map<String, Object>>) statInfo.get("req_data_info");
        List<Map<String, Object>> returnStatList = (List<Map<String, Object>>) statInfo.get("return_data_info");

        for(int i = 0; i < reqStatList.size(); i++) {
            Map<String, Object> reqStatInfo = reqStatList.get(i);
            Map<String, Object> returnStatInfo = returnStatList.get(i);

            row = sheet.createRow(r++);
            c = 0;

            for(String key : keys) {
                String str = "";

                if(reqStatInfo.get(key) != null) str = reqStatInfo.get(key).toString();
                cell = row.createCell(c++);
                if(StringUtils.isNumeric(str) && !ExcelExportEnum.isNumIgnore(key)) cell.setCellValue(!"".equals(str) ? Long.parseLong(str) : 0);
                else cell.setCellValue(str);
                cell.setCellStyle(styleBody);

                if(c <= 1) continue;
                if(returnStatInfo.get(key) != null) str = returnStatInfo.get(key).toString();
                cell = row.createCell(c++);
                if(StringUtils.isNumeric(str) && !ExcelExportEnum.isNumIgnore(key)) cell.setCellValue(!"".equals(str) ? Long.parseLong(str) : 0);
                else cell.setCellValue(str);
                cell.setCellStyle(styleBody);
            }
        }

        cellLength = colNames.length * 2 - 1;
        for(int i = 0; i < cellLength; i++) {
            sheet.autoSizeColumn(i);
            sheet.setColumnWidth(i, sheet.getColumnWidth(i) * 17/10);
        }
    }

    @SuppressWarnings("unchecked")
    private void excelExportMultiSheetData(Map<String, Object> dataInfo, Workbook workbook, CellStyle styleHead, CellStyle styleBody, String[] colNames, String[] keys, String fileName, String titleDesc, Map<String, Object> searchCondition) {
        List<Map<String, Object>> dataList = (List<Map<String, Object>>) dataInfo.get("data_list");
        List<Map<String, Object>> sheetInfoList = (List<Map<String, Object>>) dataInfo.get("sheet_list");
        int startIdx = 0;

        for(Map<String, Object> sheetInfo : sheetInfoList) {
            Sheet sheet = workbook.createSheet(sheetInfo.get("NAME").toString());
            Row row;
            Cell cell;
            int r = 0;
            int c = 0;

            if(!"".equals(titleDesc)) {
                row = sheet.createRow(r++);
                cell = row.createCell(0);
                cell.setCellValue(titleDesc + "(" + searchCondition.get("start_date") + " ~ " + searchCondition.get("end_date") + ")");
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, (colNames.length - 1) * 2));
            }

            row = sheet.createRow(r++);
            for(String colName : colNames) {
                cell = row.createCell(c++);
                cell.setCellValue(colName);
                cell.setCellStyle(styleHead);
            }

            int bookCnt = Integer.parseInt(sheetInfo.get("BOOK_CNT").toString());

            for(int i = startIdx; i < bookCnt; i++) {
                Map<String, Object> dataMap = dataList.get(i);

                row = sheet.createRow(r++);
                c = 0;

                for(String key : keys) {
                    String str = "";

                    if(dataMap.get(key) != null) str = dataMap.get(key).toString();

                    cell = row.createCell(c++);

                    if(StringUtils.isNumeric(str) && !ExcelExportEnum.isNumIgnore(key)) cell.setCellValue(!"".equals(str) ? Long.parseLong(str) : 0);
                    else cell.setCellValue(str);
                    cell.setCellStyle(styleBody);
                }

                startIdx += bookCnt;
            }

            for(int i = 0; i < colNames.length; i++) {
                sheet.autoSizeColumn(i);
                sheet.setColumnWidth(i, sheet.getColumnWidth(i) * 17/10);
            }
        }
    }
}
