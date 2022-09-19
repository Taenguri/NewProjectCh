<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />


<c:choose>
    <c:when test="${httpCode == 404}">
        <article class="error404">
            <img src="${ctx }/images/errorImg1.png" alt="">

            <h1>방문 페이지의 주소가 잘못 입력되었거나, <br/>
                페이지의 주소가 변경 혹은 삭제되어 찾을 수 없습니다.</h1>
            <h2>입력하신 주소가 정확한지 다시 한번 확인해 주세요.</h2>
            <p>지속적으로 문제 발생시 고객센터에 문의바랍니다.</p>
            <input type="button" class="btn errorMain" value="메인페이지로 이동" />
            <input type="button" class="btn errorPrev" value="이전페이지로 이동" />

        </article>
    </c:when>
    <c:when test="${httpCode == 500}">
        <article class="error500">
            <img src="${ctx }/images/errorImg1.png" alt="">
            <h1>서버 장애가 발생하였습니다. </h1>
            <p>지속적으로 문제 발생시 고객센터에 문의바랍니다.</p>
            <input type="button" class="btn errorMain" value="메인페이지로 이동" />
            <input type="button" class="btn errorPrev" value="이전페이지로 이동" />

        </article>
    </c:when>
    <c:otherwise>
        <article class="errorCom">
            <img src="${ctx }/images/errorImg1.png" alt="">
            <h1>통신 장애가 발생하였습니다. (${httpCode})</h1>
            <p>지속적으로 문제 발생시 고객센터에 문의바랍니다.</p>
            <input type="button" class="btn errorMain" value="메인페이지로 이동" />
            <input type="button" class="btn errorPrev" value="이전페이지로 이동" />

        </article>
    </c:otherwise>
</c:choose>

<script src="<c:url value="/javascript/error/error.js" />"></script>