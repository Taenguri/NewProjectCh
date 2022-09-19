<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
	<head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="_csrf" content="${_csrf.token}"/>
        <meta name="_csrf_header" content="${_csrf.headerName}"/>
        <meta name="Referrer-Policy" content="no-referrer | same-origin"/>
        <link href="<c:url value="/css/BookPaybackMng_2021.css" />" rel="stylesheet" type="text/css" />
        <link rel="shortcut icon" href="<c:url value="/images/favicon.ico" />" />
        <title>오류안내</title>
    </head>
	<body class="errorBody">
		<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" id="comn_csrf_param" />
		<input type="hidden" name="ctx" value="${pageContext.request.contextPath }" id="ctx" />
		<div class="errorWrap">
			<tiles:insertAttribute name="content"/>
		</div>
	</body>
</html>
