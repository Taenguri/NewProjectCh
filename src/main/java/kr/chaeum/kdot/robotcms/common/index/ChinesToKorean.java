package kr.chaeum.kdot.robotcms.common.index;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.IOException;
import java.io.InputStream;

@Component
@Slf4j
public class ChinesToKorean {
    private static final String CHINES_XML_FILE_PATH;
    private static final String CHAR_SET;
    private static char[] chinesToKoreanMap;

    static {
        CHINES_XML_FILE_PATH = "chinestokorean.xml";
        CHAR_SET = "UTF-8";
    }

    public static String convertChinesToKorean(String source) throws Exception {
        String chines = specialCharacterReplace(source);

        char unicode = 0x0000;
        byte[] chinesByte = chines.getBytes(CHAR_SET);

        for (int i = 0; i < chinesByte.length; ) {
            if ((chinesByte[i] & 0xFF) < 0x80) {
                i++;
                continue;
            } else if ((chinesByte[i] & 0xFF) < 0xE0) {
                i += 2;
                continue;
            } else if ((chinesByte[i] & 0xFF) < 0xF0) {
                unicode = (char) (chinesByte[i] & 0x0f);
                i++;
                unicode = (char) (unicode << 6);
                unicode = (char) (unicode | (chinesByte[i] & 0x3f));
                i++;
                unicode = (char) (unicode << 6);
                unicode = (char) (unicode | (chinesByte[i] & 0x3f));
                i++;
            }

            if (chinesToKoreanMap == null || chinesToKoreanMap.length == 0) getChinesInfoInit();

            if (chinesToKoreanMap[unicode] != unicode) {
                unicode = chinesToKoreanMap[unicode];
                chinesByte[i - 1] = (byte) ((unicode & 0x3f) | 0x80);
                chinesByte[i - 2] = (byte) (((unicode << 2) & 0x3f00 | 0x8000) >> 8);
                chinesByte[i - 3] = (byte) (((unicode << 4) & 0x3f0000 | 0xe00000) >> 16);
            }
        }
        return new String(chinesByte, CHAR_SET);
    }

    private static String specialCharacterReplace(String source) {
        String match = "[`\":~!@#$%<>^&*?()=+_|{}.'\\[\\]\\/,\\·-]";
        String data = source.replaceAll("%22", "\"").replaceAll("%27", "'");
        data = data.replaceAll("%3C", "<").replaceAll("%3E", ">");
        data = data.replaceAll("&quot;", "\"");
        data = data.replaceAll(match, "");

        return data;
    }

    private static void getChinesInfoInit() {
        log.info("CHINES DATA SET START");

        Resource resource = new ClassPathResource(CHINES_XML_FILE_PATH);
        InputStream is = null;

        try {
            is = resource.getInputStream();
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            dbf.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
            dbf.setAttribute(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");

            DocumentBuilder builder = dbf.newDocumentBuilder();
            Document doc = builder.parse(is);
            NodeList nList = doc.getElementsByTagName("UnicodeMap");
            Node nNode = nList.item(0);
            String buffer = "";

            if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                Element eElement = (Element) nNode;
                buffer = getContent(eElement, "Code");
            }

            buffer = buffer.replaceAll("\n", "");
            buffer = buffer.replaceAll("\r", "");

            String[] codeList = buffer.split(",");
            chinesToKoreanMap = new char[codeList.length];

            for (int index = 0; index < codeList.length; index++) {
                chinesToKoreanMap[index] = (char) Integer.decode(codeList[index].trim()).intValue();
            }
        } catch (Exception e) {
            log.error("INDEX CHINESE INIT ERROR : " + e);

            try {
                if (is != null) is.close();
            } catch (IOException ioe) {
                log.error("CHINESE INDEX FILE IO ERROR : ", ioe);
            }
        }
    }

    private static String getContent(Element element, String tagName) {
        NodeList list = element.getElementsByTagName(tagName);
        Element cElement = (Element) list.item(0);

        if (cElement.getFirstChild() != null) {
            return cElement.getFirstChild().getNodeValue();
        } else {
            return "";
        }
    }

    @EventListener(ApplicationReadyEvent.class)
    public void start() {
        getChinesInfoInit();
    }
}
