variable "zone_id" {
	description = "The zone id of the DNS zone"
	validation {
		condition     = length(var.zone_id) > 0
		error_message = "zone_id is required"
	}
}

variable "root_name" {
	description = "The root name to be used for the DNS record"
	validation {
		condition     = length(var.root_name) > 0
		error_message = "root_name is required"
	}
}

variable "prefix" {
	description = "The prefix to be used for the DNS record"
	validation {
		condition     = length(var.prefix) > 0
		error_message = "prefix is required"
	}
}
