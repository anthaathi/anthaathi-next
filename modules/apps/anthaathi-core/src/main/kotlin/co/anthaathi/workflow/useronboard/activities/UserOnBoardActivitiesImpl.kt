package co.anthaathi.workflow.useronboard.activities

import co.anthaathi.entity.OrganizationInvitation
import co.anthaathi.rest.client.OryAdmin
import io.quarkus.mailer.Mail
import io.quarkus.mailer.reactive.ReactiveMailer
import jakarta.enterprise.context.control.ActivateRequestContext
import jakarta.inject.Inject
import jakarta.inject.Singleton
import org.eclipse.microprofile.rest.client.inject.RestClient
import java.time.Duration
import java.util.*


@Singleton
@ActivateRequestContext
class UserOnBoardActivitiesImpl(
	@RestClient
	val oryAdmin: OryAdmin,
	@Inject
	var reactiveMailer: ReactiveMailer,
) : UserOnBoardActivities {
	override fun inviteUser(email: List<String>, role: String, org: String): String {
		val result = email.map {
			oryAdmin.getIdentities(it)?.firstOrNull() ?: return@map null
		}.filterNotNull()

		result.forEach {
			val invitation = OrganizationInvitation().apply {
				userId = UUID.fromString(it.id)
				organizationId = UUID.randomUUID()
			}
		}

		email.forEach {
			val mail = Mail.withHtml(it, "Subject", "Hello world").setText("Hello world")

			reactiveMailer.send(mail)
				.await()
				.atMost(Duration.ofSeconds(10))
		}

		return "pass"
	}
}
