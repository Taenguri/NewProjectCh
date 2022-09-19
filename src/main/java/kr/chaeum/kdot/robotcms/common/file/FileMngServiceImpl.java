package kr.chaeum.kdot.robotcms.common.file;

import kr.chaeum.kdot.robotcms.common.method.ChaeumMethod;
import kr.chaeum.kdot.robotcms.common.validation.ChaeumValidation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileMngServiceImpl extends EgovAbstractServiceImpl implements FileMngService {
    @Value("${file.upload.image-path}")
    private String editorImagePath;

    @Value("${file.upload.attach-path}")
    private String attachFilePath;

    private final ChaeumValidation chaeumValidation;
    private final ChaeumMethod chaeumMethod;

    @Override
    public Map<String, Object> editorImageUpload(MultipartFile file, HttpServletRequest request) {
        try {
            return this.uploadFile(file, "IMAGE", request);
        } catch (IOException e) {
            log.error("IMAGE FILE UPLOAD ERROR : ", e);
            return this.chaeumValidation.errorResult("이미지 업로드가 실패하였습니다.");
        }
    }

    private String getFileExtension(final String fileName) {
        if(this.chaeumValidation.isNull(fileName)) return "png";
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }

    @Override
    public Map<String, Object> uploadAttachFile(MultipartFile file, HttpServletRequest request) {
        // file_name, file_path 결과 리턴필요
        try {
            return this.uploadFile(file, "ATTACH", request);
        } catch (IOException e) {
            log.error("IMAGE FILE UPLOAD ERROR : ", e);
            return this.chaeumValidation.errorResult("이미지 업로드가 실패하였습니다.");
        }
    }

    private Map<String, Object> uploadFile(MultipartFile file, String uploadType, HttpServletRequest request) throws IOException {
        String fileExtension = this.getFileExtension(file.getOriginalFilename());
        String encodeFileName = UUID.randomUUID().toString().replaceAll("-", "") + "." + fileExtension;
        String date = new SimpleDateFormat("yyyyMMdd", this.chaeumMethod.getLocale()).format(new Date());
        String uploadPath = ("ATTACH".equals(uploadType) ? attachFilePath : editorImagePath) + "/" + date;

        File directory = new File(uploadPath);
        if(!directory.exists() && !directory.mkdirs()) {
            return this.chaeumValidation.errorResult(("ATTACH".equals(uploadType) ? "첨부파일" : "이미지") + " 업로드 폴더 생성이 실패하였습니다.");
        }

        if("ATTACH".equals(uploadType)) {
            log.info("UPLOAD ATTACH FILE PATH : {}", uploadPath + "/" + encodeFileName);
        } else {
            log.info("UPLOAD IMAGE FILE PATH : {}", uploadPath + "/" + encodeFileName);
            //log.info("UPLOAD IMAGE URL : {}", editorImageUrl + uploadPath + "/" + encodeFileName);
        }

        file.transferTo(Paths.get(uploadPath + "/" + encodeFileName));

        Map<String, Object> resultMap = new HashMap<>();

        if("ATTACH".equals(uploadType)) {
            resultMap.put("file_name", file.getOriginalFilename());
            resultMap.put("file_path", uploadPath + "/" + encodeFileName);
        } else {
            //resultMap.put("url", editorImageUrl + "/" + date + "/" + encodeFileName);
        }

        return this.chaeumValidation.successResult(resultMap);
    }

    @Override
    public Map<String, Object> deleteAttachFile(final String filePath) {
        try {
            File file = new File(filePath);
            if(!file.delete()) {
                return this.chaeumValidation.errorResult("업로드파일 삭제가 실패하였습니다. 파일확인 안됨");
            }
            return this.chaeumValidation.successResult(null);
        } catch (Exception e) {
            log.error("UPLOAD FILE DELETE ERROR : ", e);
            return this.chaeumValidation.errorResult("업로드파일 삭제가 실패하였습니다.");
        }
    }

    @Override
    public void attachFileDownload(final String oriFileName, final String filePath, HttpServletRequest request, HttpServletResponse response) {
        try {
            setDownloadResponse(oriFileName, request, response);

            InputStream in = Files.newInputStream(Paths.get(filePath));
            OutputStream os = response.getOutputStream();

            FileCopyUtils.copy(in, os);
        } catch (UnsupportedEncodingException e) {
            log.error("SET DOWNLOAD FILE INFO RESPONSE ERROR : ", e);
        } catch (IOException e) {
            log.error("FILE DOWNLOAD ERROR : ", e);
        }
    }

    private void setDownloadResponse(final String fileName, HttpServletRequest request, HttpServletResponse response) throws UnsupportedEncodingException {
        String encodeFileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
        if(request.getHeader("User-Agent").contains("MSIE 5.5")) {
            response.setHeader("Content-Disposition", "filename=" + encodeFileName + ";");
        } else {
            response.setContentType("application/x-msdownload");
            response.setHeader("Content-Disposition", "attachment; filename=" + encodeFileName + ";");
        }
    }
}
