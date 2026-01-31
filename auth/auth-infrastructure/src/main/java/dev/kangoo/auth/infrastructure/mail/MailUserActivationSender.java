package dev.kangoo.auth.infrastructure.mail;

import dev.kangoo.auth.application.port.UserActivationNotificationSender;
import dev.kangoo.auth.domain.model.user.Email;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;

@Component
public class MailUserActivationSender implements UserActivationNotificationSender {

    private static final Logger log = LogManager.getLogger(MailUserActivationSender.class);

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public MailUserActivationSender(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Override
    public void send(Email email) {
        try {
            MimeMessage mimeMessage = this.mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            Context context = new Context();
            String activationUrl = "https://kangoo.dev/activate?token=" + email.value(); //
            context.setVariable("activationUrl", activationUrl);

            String htmlContent = this.templateEngine.process("activation-email", context);

            helper.setTo(email.value()); //
            helper.setSubject("Finalize your Registration");
            helper.setFrom("no-reply@kangoo.dev");
            helper.setText(htmlContent, true);

            this.mailSender.send(mimeMessage);
            log.info("Mail activation email sent to {}", email.value());

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send activation email", e);
        }
    }
}
