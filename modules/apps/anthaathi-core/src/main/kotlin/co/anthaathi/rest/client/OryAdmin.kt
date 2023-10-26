package co.anthaathi.rest.client

import co.anthaathi.rest.client.types.IdentityElement
import jakarta.ws.rs.*
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient


@Path("/admin")
@RegisterRestClient(configKey = "kratos-admin-api")
interface OryAdmin {
	@GET
	@Path("/identities")
	fun getIdentities(
		@QueryParam("credentials_identifier") credentialsIdentifier: String? = null,
		@QueryParam("per_page") perPage: Int? = 250,
		@QueryParam("page") page: Int = 1,
		): List<IdentityElement?>?
}
