package kr.chaeum.kdot.robotcms.config.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class SystemAspect {
    @AfterThrowing(pointcut = "execution(* kr.chaeum.kdot.robotcms..*.*(..))", throwing = "ex")
    public void insertExceptionInfo(JoinPoint joinPoint, Throwable ex) {
        Signature signature = joinPoint.getSignature();

        log.error("Method Name : " + signature.getName());
        log.error("Arguments : " + Arrays.toString(joinPoint.getArgs()));
        log.error("Stuff : " + signature);
        log.error("Exception Info : " + ex.toString());
    }
}
