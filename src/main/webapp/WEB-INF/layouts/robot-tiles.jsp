<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <c:set var="ctx" value="${pageContext.request.contextPath}" />
    <c:set var="session_max_time" value="${session.getMaxInactiveInterval()}" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="_csrf" content="${_csrf.token}"/>
    <meta name="_csrf_header" content="${_csrf.headerName}"/>
    <meta name="Referrer-Policy" content="no-referrer | same-origin"/>
    <link href="<c:url value="/css/datepicker/datepicker.min.css" />" rel="stylesheet" type="text/css" />
    <link href="<c:url value="/css/dropzone/dropzone.css" />" rel="stylesheet" type="text/css" />
    <link href="<c:url value="/images/favicon.ico" />" rel="shortcut icon" />
    <script src="<c:url value="/js/design/jquery.min.js" />"></script>
    <script src="<c:url value="/js/design/jquery-ui-1.12.1.js" />"></script>
    <script src="<c:url value="/js/design/jquery.smooth-scroll.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.babel-polyfill.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.polyfill.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.common.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.validation.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.dialog.js" />"></script>
    <title>실내공기관제 - 이용자</title>
</head>
<body>
    <div>
        <section class="content_wrap" id="content_wrap">
            <div class="container">
                <tiles:insertAttribute name="content"/>
            </div>
        </section>

        <%--<footer class="footer_wrap">
            <tiles:insertAttribute name="footer"/>
        </footer>--%>
    </div>
    <input type="hidden" id="ctx" value="${ctx}">
</body>
</html>
