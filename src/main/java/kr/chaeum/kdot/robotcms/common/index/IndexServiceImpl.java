package kr.chaeum.kdot.robotcms.common.index;

import kr.chaeum.kdot.robotcms.common.method.ChaeumMethod;
import kr.chaeum.kdot.robotcms.common.validation.ChaeumValidation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class IndexServiceImpl extends EgovAbstractServiceImpl implements IndexService {
    private static final String CHAR_SET;
    private static final String SPECIAL_REPLACE_PATTERN;
    private static final String[] HTML_SPECIAL_CHAR;
    private static final int MAX_VARCHAR_LENGTH;
    private static final int MAX_VARCHAR_POSSIBLE_LENGTH;

    static {
        CHAR_SET = "UTF-8";
        SPECIAL_REPLACE_PATTERN = "[`\":~!@#$%<>^&*?()=+_|{}.'\\[\\]\\/,\\·-]";
        HTML_SPECIAL_CHAR = new String[] {
                "&lsquo;","&rsquo;","&sbquo;","&ldquo;","&rdquo;","&bdquo;","&dagger;","&Dagger;",
                "&permil;","&lsaquo;","&rsaquo;","&spades;","&clubs;","&hearts;","&diams;","&oline;",
                "&larr;","&uarr;","&rarr;","&darr;","&trade;","&quot;","&amp;","&frasl;","&lt;",
                "&gt;","&hellip;","&ndash;","&mdash;","&iexcl;","&cent;","&pound;","&curren;","&yen;",
                "&brvbar;","&brkbar;","&sect;","&uml;","&die;","&copy;","&ordf;","&laquo;","&not;",
                "&shy;","&reg;","&macr;","&hibar;","&deg;","&plusmn;","&sup2;","&sup3;","&acute;",
                "&micro;","&para;","&middot;","&cedil;","&sup1;","&ordm;","&raquo;","&frac14;","&frac12;",
                "&frac34;","&iquest;","&Agrave;","&Aacute;","&Acirc;","&Atilde;","&Auml;","&Aring;",
                "&AElig;","&Ccedil;","&Egrave;","&Eacute;","&Ecirc;","&Euml;","&Igrave;","&Iacute;","&Icirc;",
                "&Iuml;","&ETH;","&Ntilde;","&Ograve;","&Oacute;","&Ocirc;","&Otilde;","&Ouml;","&times;",
                "&Oslash;","&Ugrave;","&Uacute;","&Ucirc;","&Uuml;","&Yacute;","&THORN;","&szlig;","&agrave;",
                "&aacute;","&acirc;","&atilde;","&auml;","&aring;","&aelig;","&ccedil;","&egrave;","&eacute;",
                "&ecirc;","&euml;","&igrave;","&iacute;","&icirc;","&iuml;","&eth;","&ntilde;","&ograve;",
                "&oacute;","&ocirc;","&otilde;","&ouml;","&divide;","&oslash;","&ugrave;","&uacute;","&ucirc;",
                "&uuml;","&yacute;","&thorn;","&yuml;","&Alpha;","&alpha;","&Beta;","&beta;","&Gamma;","&gamma;",
                "&Delta;","&delta;","&Epsilon;","&epsilon;","&Zeta;","&zeta;","&Eta;","&eta;","&Theta;","&theta;",
                "&Iota;","&iota;","&Kappa;","&kappa;","&Lambda;","&lambda;","&Mu;","&mu;","&Nu;","&nu;","&Xi;",
                "&xi;","&Omicron;","&omicron;","&Pi;","&pi;","&Rho;","&rho;","&Sigma;","&sigma;","&Tau;",
                "&tau;","&Upsilon;","&upsilon;","&Phi;","&phi;","&Chi;","&chi;","&Psi;","&psi;","&Omega;",
                "&omega;","&#9679;","&#8226;","&#00;","&#08;","&#09;","&#10;","&#11;","&#32;","&#33;","&#34;",
                "&#35;","&#36;","&#37;","&#38;","&#39;","&#40;","&#41;","&#42;","&#43;","&#44;","&#45;","&#46;",
                "&#47;","&#48;","&#57;","&#58;","&#59;","&#60;","&#61;","&#62;","&#63;","&#64;","&#65;","&#90;",
                "&#91;","&#92;","&#93;","&#94;","&#95;","&#96;","&#97;","&#122;","&#123;","&#124;","&#125;",
                "&#126;","&#133;","&#150;","&#151;","&#152;","&#159;"};
        MAX_VARCHAR_LENGTH = 4000;
        MAX_VARCHAR_POSSIBLE_LENGTH = 1300;
    }

    private final ChaeumValidation chaeumValidation;
    private final ChaeumMethod chaeumMethod;

    @Override
    public String getIndexData(String source) {
        if(this.chaeumValidation.isNull(source)) return null;

        String resultData = null;

        try {
            String indexData = ChinesToKorean.convertChinesToKorean(this.chaeumMethod.removeHtmlTag(source))
                    .replaceAll(SPECIAL_REPLACE_PATTERN, "")
                    .toUpperCase();
            resultData = indexData + " ";

            StringBuilder appendBuff = new StringBuilder();
            StringBuilder indexBuff = new StringBuilder();

            while(true) {
                if(indexData.contains(" ")) {
                    appendBuff.append(indexData, 0, indexData.indexOf(" "));
                    indexBuff.append(appendBuff).append(' ');

                    indexData = indexData.substring(indexData.indexOf(" ") + 1);
                } else {
                    appendBuff.append(indexData);
                    indexBuff.append(appendBuff);
                    break;
                }
            }

            if(!this.chaeumValidation.isNull(indexBuff) && indexBuff.toString().getBytes(CHAR_SET).length > MAX_VARCHAR_LENGTH) {
                resultData += indexBuff.substring(0, MAX_VARCHAR_POSSIBLE_LENGTH);
            } else {
                resultData += indexBuff.toString();
            }
        } catch (Exception e) {
            log.error("MAKE INDEX ERROR : ", e);
        }

        return resultData;
    }

    @Override
    public String getShortAuthor(final String author, final String splitChar) {
        if(this.chaeumValidation.isNull(author)) return this.chaeumMethod.removeHtmlTag(author);
        String[] authors = author.split(splitChar);
        return authors.length > 1 ? this.chaeumMethod.removeHtmlTag(authors[0]) + " 외 " + (authors.length - 1) + "명" : this.chaeumMethod.removeHtmlTag(author);
    }
}
