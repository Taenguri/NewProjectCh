<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div class="logoutWrap">
	<span class="remainTimeWrap" tabindex="0">
		<span class="remainTimeText">로그아웃까지 남은시간</span>
		<strong id="session_minute"><%= session.getMaxInactiveInterval() / 60 %></strong> : <strong id="session_second">00</strong> <span class="remainTimeSecond"></span>
		<input type="hidden" id="session_max_time" value=<%= session.getMaxInactiveInterval() %>>
		<input type="hidden" id="login_type" value="${_LOGIN_TYPE_}">
	</span>

	<!-- <a href="#" id="goLibHomepage" class="btnGoHomepage" target="_blank">Homepage</a> -->
	<button id="logoutBtn" class="logOutBtn">로그아웃</button>
	<button id="displayPrintBtn" class="logOutBtn">인쇄</button>
</div>
<script src="<c:url value="/js/layouts/logoutinfo.js" />"></script>
