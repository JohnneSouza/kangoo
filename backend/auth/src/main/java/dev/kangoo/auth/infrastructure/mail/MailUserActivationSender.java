package dev.kangoo.auth.infrastructure.mail;

import dev.kangoo.auth.application.port.UserActivationNotificationSender;
import dev.kangoo.auth.domain.user.Email;
import dev.kangoo.auth.domain.user.TokenValue;
import dev.kangoo.auth.infrastructure.config.ActivationProperties;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;

@Component
public class MailUserActivationSender implements UserActivationNotificationSender {

    private static final Logger log = LoggerFactory.getLogger(MailUserActivationSender.class);

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final ActivationProperties activationProperties;

    public MailUserActivationSender(JavaMailSender mailSender, TemplateEngine templateEngine,
                                    ActivationProperties activationProperties) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.activationProperties = activationProperties;
    }

    @Override
    public void send(Email email, TokenValue token) {
        try {
            MimeMessage mimeMessage = this.mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            Context context = new Context();
            context.setVariable("activationUrl", this.activationProperties.activationUrl(token.value()));

            String htmlContent = this.templateEngine.process("activation-email", context);

            helper.setTo(email.value());
            helper.setSubject("Finalize your Registration");
            helper.setFrom("no-reply@kangoo.dev");
            helper.setText(htmlContent, true);

            this.mailSender.send(mimeMessage);
            log.info("Activation email sent to {}", email.value());

        } catch (MessagingException | MailException e) {
            throw new IllegalStateException("Failed to send activation email", e);
        }
    }
}
