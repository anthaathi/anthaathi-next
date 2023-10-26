package co.anthaathi.rest.client.types

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.JsonNode
import java.util.*

data class IdentityElement (
	@get:JsonProperty("created_at", required=false)@field:JsonProperty("created_at", required=false)
	val createdAt: Date?,

	@get:JsonProperty(required=true)@field:JsonProperty(required=true)
	val id: String,

	@get:JsonProperty("metadata_admin")@field:JsonProperty("metadata_admin")
	val metadataAdmin: Any? = null,

	@get:JsonProperty("metadata_public")@field:JsonProperty("metadata_public")
	val metadataPublic: Any? = null,

	@get:JsonProperty("recovery_addresses", required=false)@field:JsonProperty("recovery_addresses", required=false)
	val recoveryAddresses: List<RecoveryAddress>?,

	@get:JsonProperty("schema_id", required=false)@field:JsonProperty("schema_id", required=false)
	val schemaID: String?,

	@get:JsonProperty("schema_url", required=false)@field:JsonProperty("schema_url", required=false)
	val schemaURL: String?,

	@get:JsonProperty(required=true)@field:JsonProperty(required=true)
	val state: String,

	@get:JsonProperty("state_changed_at", required=false)@field:JsonProperty("state_changed_at", required=false)
	val stateChangedAt: String?,

	val traits: Any? = null,

	@get:JsonProperty("updated_at", required=false)@field:JsonProperty("updated_at", required=false)
	val updatedAt: Date?,

	@get:JsonProperty("verifiable_addresses", required=false)@field:JsonProperty("verifiable_addresses", required=false)
	val verifiableAddresses: List<VerifiableAddress?>?
)

typealias Config = JsonNode
