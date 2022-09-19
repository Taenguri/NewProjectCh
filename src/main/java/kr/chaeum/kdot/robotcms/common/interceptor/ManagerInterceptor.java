package kr.chaeum.kdot.robotcms.common.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class ManagerInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        boolean isAjaxRequest = request.getHeader("ajax-request") != null && "true".equals(request.getHeader("ajax-request"));

        // 관리자 페이지와 사용자 페이지 처리
        if (isAjaxRequest && session.getAttribute("_MANAGER_ID_") == null) {
            response.sendError(6653);
            return false;
        } else if (session.getAttribute("_MANAGER_ID_") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return false;
        }
        return true;
    }
}
