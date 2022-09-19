package kr.chaeum.kdot.robotcms.config.egov;

import org.egovframe.rte.fdl.cmmn.trace.LeaveaTrace;
import org.egovframe.rte.fdl.cmmn.trace.handler.DefaultTraceHandler;
import org.egovframe.rte.fdl.cmmn.trace.handler.TraceHandler;
import org.egovframe.rte.fdl.cmmn.trace.manager.DefaultTraceHandleManager;
import org.egovframe.rte.fdl.cmmn.trace.manager.TraceHandlerService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.AntPathMatcher;

@Configuration
public class EgovConfig {
    @Bean(name="leaveaTrace")
    public LeaveaTrace leaveaTrace(DefaultTraceHandleManager traceService) {
        LeaveaTrace leaveaTrace = new LeaveaTrace();
        leaveaTrace.setTraceHandlerServices(new TraceHandlerService[] {traceService});
        return leaveaTrace;
    }

    @Bean(name="traceHandlerService")
    public DefaultTraceHandleManager traceHandleManager(AntPathMatcher antPathMatcher, DefaultTraceHandler defaultTraceHandler) {
        DefaultTraceHandleManager defaultTraceHandleManager = new DefaultTraceHandleManager();
        defaultTraceHandleManager.setReqExpMatcher(antPathMatcher);
        defaultTraceHandleManager.setPatterns(new String[] {"*"});
        defaultTraceHandleManager.setHandlers(new TraceHandler[] {defaultTraceHandler});
        return defaultTraceHandleManager;
    }

    @Bean(name="antPathMatcher")
    public AntPathMatcher antPathMatcher() {
        return new AntPathMatcher();
    }

    @Bean(name="defaultTraceHandler")
    public DefaultTraceHandler defaultTraceHandler() {
        return new DefaultTraceHandler();
    }
}
