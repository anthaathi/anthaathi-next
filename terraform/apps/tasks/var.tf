variable "prefix" {
	validation {
		condition     = length(var.prefix) > 0
		error_message = "Prefix is required"
	}
}

variable "zone_id" {
	type = string
}

variable "base_domain" {
	type = string
}
