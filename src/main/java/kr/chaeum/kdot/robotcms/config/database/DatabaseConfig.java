package kr.chaeum.kdot.robotcms.config.database;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import net.sf.log4jdbc.Log4jdbcProxyDataSource;
import net.sf.log4jdbc.tools.Log4JdbcCustomFormatter;
import net.sf.log4jdbc.tools.LoggingType;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@EnableTransactionManagement
public class DatabaseConfig {
    @Value("${mybatis.mapper-locations}")
    private Resource[] mapperLocations;

    @Value("${database.user-name}")
    private String lasDbUserName;

    @Value("${database.date-format}")
    private String systemDateFormat;

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.hikari")
    public HikariConfig hikariConfig() {
        return new HikariConfig();
    }

    @Bean
    public DataSource dataSource() {
        return new HikariDataSource(hikariConfig());
    }

    @Bean(name = "sqlSession")
    public SqlSessionFactory sqlSessionFactory() throws Exception {
        Properties prop = new Properties();
        prop.setProperty("las_db_name", lasDbUserName);
        prop.setProperty("system_date_format", systemDateFormat);

        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(logDataSource());
        factoryBean.setMapperLocations(mapperLocations);
        factoryBean.setConfigurationProperties(prop);
        factoryBean.setTypeAliasesPackage("kr.chaeum.kdot.robotcms");
        factoryBean.setConfiguration(mybatisConfig());

        return factoryBean.getObject();
    }

    @Bean
    public Log4jdbcProxyDataSource logDataSource() {
        Log4jdbcProxyDataSource source = new Log4jdbcProxyDataSource(dataSource());
        Log4JdbcCustomFormatter formatter = new Log4JdbcCustomFormatter();
        formatter.setLoggingType(LoggingType.SINGLE_LINE);
        formatter.setSqlPrefix("QUERY : ");
        source.setLogFormatter(formatter);
        return source;
    }

    @Bean
    public SqlSessionTemplate sqlSessionTemplate() throws Exception {
        return new SqlSessionTemplate(sqlSessionFactory());
    }

    @Bean(name = "transactionManager")
    public DataSourceTransactionManager dataSourceTransactionManager() {
        return new DataSourceTransactionManager(logDataSource());
    }

    @Bean
    @ConfigurationProperties(prefix = "mybatis.configuration")
    public org.apache.ibatis.session.Configuration mybatisConfig() {
        return new org.apache.ibatis.session.Configuration();
    }

    @Bean
    public PlatformTransactionManager transactionManager() {
        return new DataSourceTransactionManager(dataSource());
    }
}
