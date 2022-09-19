package kr.chaeum.kdot.robotcms.example;

import kr.chaeum.kdot.robotcms.common.validation.ChaeumValidation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/example")
@Slf4j
@RequiredArgsConstructor
public class ExampleController {
    private final ExampleService exampleService;
    private final ChaeumValidation chaeumValidation;

    @GetMapping(value = "/page")
    public ModelAndView examplePage() {
        return new ModelAndView("/example/example.robot");
    }

    @GetMapping(value = "/test/{param}")
    public ResponseEntity<Map<String, Object>> getExample(@PathVariable("param") String param) {
        try {
            return ResponseEntity.ok().body(this.exampleService.example());
        } catch (Exception e) {
            log.error("GET EXAMPLE ERROR");
            return this.chaeumValidation.badRequest("예제 작업중에 오류가 났습니다.");
        }
    }

    @GetMapping(value = "test")
    public ResponseEntity<List<Map<String, Object>>> getList() {
        return ResponseEntity.ok().body(new ArrayList<>());
    }
}
