variable "prefix" {
	description = "The prefix to be used for the DNS record"
	validation {
		condition     = length(var.prefix) > 0
		error_message = "prefix is required"
	}
}
