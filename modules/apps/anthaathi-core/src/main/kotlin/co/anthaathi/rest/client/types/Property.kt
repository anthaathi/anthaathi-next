package co.anthaathi.rest.client.types

import com.fasterxml.jackson.annotation.JsonProperty

data class Property(
	@get:JsonProperty(required = true) @field:JsonProperty(required = true)
	val config: Config,

	@get:JsonProperty("created_at", required = true) @field:JsonProperty("created_at", required = true)
	val createdAt: String,

	@get:JsonProperty(required = true) @field:JsonProperty(required = true)
	val identifiers: List<String>,

	@get:JsonProperty(required = true) @field:JsonProperty(required = true)
	val type: String,

	@get:JsonProperty("updated_at", required = true) @field:JsonProperty("updated_at", required = true)
	val updatedAt: String,

	@get:JsonProperty(required = true) @field:JsonProperty(required = true)
	val version: Long
)
