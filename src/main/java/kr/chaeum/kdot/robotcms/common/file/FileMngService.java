package kr.chaeum.kdot.robotcms.common.file;

import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

public interface FileMngService {
    Map<String, Object> editorImageUpload(MultipartFile file, HttpServletRequest request);

    Map<String, Object> uploadAttachFile(MultipartFile file, HttpServletRequest request);

    Map<String, Object> deleteAttachFile(String filePath);

    void attachFileDownload(String oriFileName, String filePath, HttpServletRequest request, HttpServletResponse response);
}
