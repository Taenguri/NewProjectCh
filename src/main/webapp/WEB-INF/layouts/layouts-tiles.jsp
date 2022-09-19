<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <c:set var="ctx" value="${pageContext.request.contextPath}" />
    <c:set var="session_max_time" value="${session.getMaxInactiveInterval()}" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta name="_csrf" content="${_csrf.token}"/>
    <meta name="_csrf_header" content="${_csrf.headerName}"/>
    <meta name="Referrer-Policy" content="no-referrer | same-origin"/>
    <link href="<c:url value="/css/datepicker/datepicker.min.css" />" rel="stylesheet" type="text/css" />
    <link href="<c:url value="/css/dropzone/dropzone.css" />" rel="stylesheet" type="text/css" />
    <link href="<c:url value="/css/common.css" />" rel="stylesheet" type="text/css" />
    <link href="<c:url value="/css/admin.css" />" rel="stylesheet" type="text/css" />
    <link href="<c:url value="/images/favicon.ico" />" rel="shortcut icon" />
    <script src="<c:url value="/js/design/jquery.min.js" />"></script>
    <script src="<c:url value="/js/design/jquery-ui-1.12.1.js" />"></script>
    <script src="<c:url value="/js/design/jquery.smooth-scroll.js" />"></script>
	<script src="<c:url value="/js/common/sha256.js" />"></script>
	<script src="<c:url value="/js/common/chaeum.babel-polyfill.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.polyfill.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.common.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.previews.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.validation.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.session.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.paging.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.dialog.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.menu.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.password.js" />"></script>
    <script src="<c:url value="/js/datepicker/datepicker.min.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.datepicker.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.checkbox.js" />"></script>
    <script src="<c:url value="/js/dropzone/dropzone.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.dropzone.js" />"></script>
	<script src="<c:url value="/js/ckeditor/ckeditor.js" />"></script>
	<script src="<c:url value="/js/common/chaeum.ckeditor.js" />"></script>
	<script src="<c:url value="/js/common/chaeum.tablesort.js" />"></script>
    <script src="<c:url value="/js/design/admin.js" />"></script>
    <title>실내공기관제</title>
</head>
<body>
    <a href="#content" class="skip">본문바로가기</a>
    <div id="wrap" class="admin">
 		<input type="hidden" id="ctx" value="${ctx}">
        <div class="admin_dashboard">
            <aside>
                <header class="header">
                    <tiles:insertAttribute name="header"/>
                </header>
            </aside>

            <section class="admin_container" id="container">
                <div class="container">
                    <tiles:insertAttribute name="content"/>
                </div>
            </section>
        </div>

        <%--<footer class="footer">
            <tiles:insertAttribute name="footer"/>
        </footer>--%>

        <input type="hidden" id="session_max_time" value=<%= session.getMaxInactiveInterval() %>>
    </div>
    <jsp:include page="/WEB-INF/views/layouts/loading.jsp" />
</body>
</html>
