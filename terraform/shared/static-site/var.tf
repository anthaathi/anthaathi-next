variable "prefix" {
	validation {
		condition     = length(var.prefix) > 0
		error_message = "Prefix is required"
	}
}

variable "deploy_domain" {
	type = string
}

variable "zone_id" {
	type = string
}
