package kr.chaeum.kdot.robotcms.config.aop;

import lombok.RequiredArgsConstructor;
import org.springframework.aop.Advisor;
import org.springframework.aop.aspectj.AspectJExpressionPointcut;
import org.springframework.aop.support.DefaultPointcutAdvisor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionManager;
import org.springframework.transaction.interceptor.NameMatchTransactionAttributeSource;
import org.springframework.transaction.interceptor.RollbackRuleAttribute;
import org.springframework.transaction.interceptor.RuleBasedTransactionAttribute;
import org.springframework.transaction.interceptor.TransactionInterceptor;

import java.util.Collections;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class TransactionAspect {
    private static final String AOP_POINTCUT_EXPRESSION;

    static {
        AOP_POINTCUT_EXPRESSION = "execution(* kr.chaeum.kdot.baroloan..*Impl.*(..))";
    }

    private final TransactionManager transactionManager;

    @Bean
    public TransactionInterceptor transactionAdvice() {
        List<RollbackRuleAttribute> rollbackRules = Collections.singletonList(new RollbackRuleAttribute(Exception.class));
        RuleBasedTransactionAttribute transactionAttribute = new RuleBasedTransactionAttribute();
        transactionAttribute.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        transactionAttribute.setRollbackRules(rollbackRules);
        transactionAttribute.setName("*");

        RuleBasedTransactionAttribute transactionReadOnlyAttribute = new RuleBasedTransactionAttribute();
        transactionReadOnlyAttribute.setReadOnly(false);

        NameMatchTransactionAttributeSource source = new NameMatchTransactionAttributeSource();
        source.addTransactionalMethod("get*", transactionReadOnlyAttribute);
        source.addTransactionalMethod("list*", transactionReadOnlyAttribute);
        source.addTransactionalMethod("select*", transactionReadOnlyAttribute);
        source.addTransactionalMethod("is*", transactionReadOnlyAttribute);
        source.addTransactionalMethod("find*", transactionReadOnlyAttribute);

        source.addTransactionalMethod("*", transactionAttribute);

        return new TransactionInterceptor(this.transactionManager, source);
    }

    @Bean
    public Advisor transactionAdvisor() {
        AspectJExpressionPointcut pointcut = new AspectJExpressionPointcut();
        pointcut.setExpression(AOP_POINTCUT_EXPRESSION);
        return new DefaultPointcutAdvisor(pointcut, transactionAdvice());
    }
}
