package kr.chaeum.kdot.robotcms.config.scheduler.task;

import kr.chaeum.kdot.robotcms.config.scheduler.DynamicAbstractScheduler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.Trigger;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class TempLoginInfoResetJob extends DynamicAbstractScheduler {
    @Override
    public void runner() {
        log.info("TEMP LOGIN INFO RESET START");
        log.info("TEMP LOGIN INFO RESET END");
    }

    @Override
    public Trigger getTrigger() {
        String cron = "0 01 0 * * *";
        return new CronTrigger(cron);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void start() {
        super.restartScheduler("TEMP LOGIN INFO RESET BATCH");
    }
}
