<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <c:set var="ctx" value="${pageContext.request.contextPath}" />
    <c:set var="session_max_time" value="${session.getMaxInactiveInterval()}" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="_csrf" content="${_csrf.token}"/>
    <meta name="_csrf_header" content="${_csrf.headerName}"/>
    <meta name="Referrer-Policy" content="no-referrer | same-origin"/>
    <link href="<c:url value="/css/common.css" />" rel="stylesheet" type="text/css" />
    <link href="<c:url value="/css/nlse.css" />" rel="stylesheet" type="text/css" />
    <link href="<c:url value="/css/datepicker/datepicker.min.css" />" rel="stylesheet" type="text/css" />
    <link href="<c:url value="/css/dropzone/dropzone.css" />" rel="stylesheet" type="text/css" />
    <link rel="shortcut icon" href="<c:url value="/images/favicon.ico" />" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="Expires" content="0"/>
	<meta http-equiv="Pragma" content="no-cache"/>
	<script src="<c:url value="/js/design/jquery.min.js" />"></script>
    <script src="<c:url value="/js/design/jquery-ui-1.12.1.js" />"></script>
    <script src="<c:url value="/js/design/jquery.smooth-scroll.js" />"></script>
    <script src="<c:url value="/js/design/design.js" />"></script>
    <script src="<c:url value="/js/common/chaeum.common.js" />"></script>
	<title>책값 돌려주기 시스템</title>
</head>
<body>
    <div>
    	<tiles:insertAttribute name="content" />
    </div>
    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" id="comn_csrf_param" />
    <input type="hidden" id="ctx" value="${ctx}">
</body>
</html>
