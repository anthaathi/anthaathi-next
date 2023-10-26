package co.anthaathi.rest.client.types

import com.fasterxml.jackson.annotation.JsonProperty
import java.util.Date

data class RecoveryAddress (
	@get:JsonProperty("created_at", required=false)@field:JsonProperty("created_at", required=false)
	val createdAt: Date?,

	@get:JsonProperty(required=true)@field:JsonProperty(required=true)
	val id: String,

	@get:JsonProperty("updated_at", required=false)@field:JsonProperty("updated_at", required=false)
	val updatedAt: Date?,

	@get:JsonProperty(required=true)@field:JsonProperty(required=true)
	val value: String,

	@get:JsonProperty(required=true)@field:JsonProperty(required=true)
	val via: String
)
