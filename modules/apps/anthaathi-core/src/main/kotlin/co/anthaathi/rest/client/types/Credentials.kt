package co.anthaathi.rest.client.types

import com.fasterxml.jackson.annotation.JsonProperty

data class Credentials(
	@get:JsonProperty(required = true) @field:JsonProperty(required = true)
	val property1: Property,

	@get:JsonProperty(required = true) @field:JsonProperty(required = true)
	val property2: Property
)
