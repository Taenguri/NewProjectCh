package kr.chaeum.kdot.robotcms.common.file;

import kr.chaeum.kdot.robotcms.common.validation.ChaeumValidation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/v1/file")
@RequiredArgsConstructor
@Slf4j
public class FileMngController {
    private final FileMngService fileMngService;
    private final ChaeumValidation chaeumValidation;

    @PostMapping(value = "/editorimage")
    public ResponseEntity<Map<String, Object>> editorImageUpload(@RequestPart("image") MultipartFile file, HttpServletRequest request) {
        try {
            return ResponseEntity.ok().body(this.fileMngService.editorImageUpload(file, request));
        } catch (Exception e) {
            log.error("EDITOR IMAGE FILE UPLOAD ERROR : ", e);
            return this.chaeumValidation.badRequest("이미지파일 업로드가 실패하였습니다.");
        }
    }
}
