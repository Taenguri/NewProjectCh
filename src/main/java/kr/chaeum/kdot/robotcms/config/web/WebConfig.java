package kr.chaeum.kdot.robotcms.config.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.navercorp.lucy.security.xss.servletfilter.XssEscapeServletFilter;
import kr.chaeum.kdot.robotcms.common.converter.HtmlCharacterEscapes;
import kr.chaeum.kdot.robotcms.common.interceptor.DeliveryManagerInterceptor;
import kr.chaeum.kdot.robotcms.common.interceptor.DeliveryUserInterceptor;
import kr.chaeum.kdot.robotcms.common.interceptor.ManagerInterceptor;
import kr.chaeum.kdot.robotcms.common.interceptor.RobotInterceptor;
import org.egovframe.rte.ptl.mvc.filter.HTMLTagFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpMethod;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.*;

import javax.servlet.Filter;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Configuration
@ComponentScan(basePackages = "kr.chaeum.kdot")
public class WebConfig implements WebMvcConfigurer {
    private static final String[] RESOURCES_LOCATIONS;
    private static final String[] RESOURCES_PATTERNS;
    private static final String[] EXCLUDE_PATH_PATTERNS;

    static {
        RESOURCES_LOCATIONS = new String[] {
                "classpath:/static/images/",
                "classpath:/static/upload/",
                "classpath:/static/css/",
                "classpath:/static/font/",
                "classpath:/static/js/"
        };

        RESOURCES_PATTERNS = new String[] {
                "/images/**",
                "/upload/**",
                "/static/css/**",
                "/font/**",
                "/static/js/**",
                "/example/**"
        };

        EXCLUDE_PATH_PATTERNS = new String[] {
                "/example/**",
                "/manager/log**",
                "/delivery/manager/log**",
                "/delivery/user/log**",
                "/css/**",
                "/font/**",
                "/js/**",
                "/resources/**"
        };
    }

    @Bean
    public FilterRegistrationBean<Filter> getFilterRegistrationBean() {
        FilterRegistrationBean<Filter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new HTMLTagFilter());
        registrationBean.setFilter(new XssEscapeServletFilter());
        registrationBean.setOrder(2);
        registrationBean.addUrlPatterns("/*");
        return registrationBean;
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(this.htmlEscapingConverter());
    }

    private HttpMessageConverter<?> htmlEscapingConverter() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.getFactory().setCharacterEscapes(new HtmlCharacterEscapes());

        MappingJackson2HttpMessageConverter htmlEscapingConverter = new MappingJackson2HttpMessageConverter();
        htmlEscapingConverter.setObjectMapper(objectMapper);

        return htmlEscapingConverter;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new ManagerInterceptor())
                .addPathPatterns("/manager/**")
                .excludePathPatterns(EXCLUDE_PATH_PATTERNS);
        registry.addInterceptor(new DeliveryManagerInterceptor())
                .addPathPatterns("/delivery/manager/**")
                .excludePathPatterns(EXCLUDE_PATH_PATTERNS);
        registry.addInterceptor(new DeliveryUserInterceptor())
                .addPathPatterns("/delivery/user/**")
                .excludePathPatterns(EXCLUDE_PATH_PATTERNS);
        registry.addInterceptor(new RobotInterceptor())
                .addPathPatterns("/robot/**")
                .excludePathPatterns(EXCLUDE_PATH_PATTERNS);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry
                .addResourceHandler(RESOURCES_PATTERNS)
                .addResourceLocations(RESOURCES_LOCATIONS)
                .setCacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic())
                .resourceChain(false)
                .addResolver(new EncodedResourceResolver())
                .addResolver(new VersionResourceResolver().addVersionStrategy(new ContentVersionStrategy(), "/**"))
                .addTransformer(new CssLinkResourceTransformer());
    }

    @Bean
    public ResourceUrlEncodingFilter resourceUrlEncodingFilter() {
        return new ResourceUrlEncodingFilter();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods(
                        HttpMethod.GET.name(),
                        HttpMethod.POST.name(),
                        HttpMethod.PUT.name(),
                        HttpMethod.PATCH.name(),
                        HttpMethod.DELETE.name()
                );
    }
}
