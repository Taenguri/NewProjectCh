package kr.chaeum.kdot.robotcms.config.scheduler;

import org.springframework.scheduling.Trigger;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

public abstract class DynamicAbstractScheduler {
    private ThreadPoolTaskScheduler scheduler;

    public void stopScheduler() {
        if(this.scheduler == null) return;
        this.scheduler.shutdown();
    }

    public void startScheduler(final String taskName) {
        this.scheduler = new ThreadPoolTaskScheduler();
        this.scheduler.setBeanName(taskName);
        this.scheduler.initialize();
        this.scheduler.schedule(getRunnable(), getTrigger());
    }

    public void restartScheduler(final String taskName) {
        this.stopScheduler();
        this.startScheduler(taskName);
    }

    private Runnable getRunnable() {
        return this::runner;
    }

    public abstract void runner();

    public abstract Trigger getTrigger();
}
