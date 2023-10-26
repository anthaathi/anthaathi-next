package co.anthaathi.rest.client.types

import com.fasterxml.jackson.annotation.JsonProperty
import java.time.Instant
import java.util.Date

data class VerifiableAddress (
	@get:JsonProperty("created_at", required=false)@field:JsonProperty("created_at", required=false)
	val createdAt: Date?,

	@get:JsonProperty(required=true)@field:JsonProperty(required=true)
	val id: String,

	@get:JsonProperty(required=true)@field:JsonProperty(required=true)
	val status: String,

	@get:JsonProperty(required=true)@field:JsonProperty(required=true)
	val value: String,

	@get:JsonProperty(required=true)@field:JsonProperty(required=true)
	val verified: Boolean,

	@get:JsonProperty("verified_at", required=false)@field:JsonProperty("verified_at", required=false)
	val verifiedAt: Date?,

	@get:JsonProperty(required=true)@field:JsonProperty(required=true)
	val via: String
)
