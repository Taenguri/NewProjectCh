package kr.chaeum.kdot.robotcms.common.index;

public interface IndexService {
    String getIndexData(String source);

    /**
     * @param author 저자명
     * @param splitChar split 문자
     * @return 저자명 외1명
     */
    String getShortAuthor(final String author, final String splitChar);
}
