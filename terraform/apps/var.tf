variable "root_domain" {
	type = string
	validation {
		condition     = length(var.root_domain) > 0
		error_message = "root_domain must be set"
	}
}

variable "prefix" {
	type = string
	validation {
		condition     = length(var.prefix) > 0
		error_message = "prefix must be set"
	}
}

variable "google_client_id" {
	type = string

	validation {
		condition     = length(var.google_client_id) > 0
		error_message = "Google Client ID is required"
	}
}

variable "google_client_secret" {
	type = string

	validation {
		condition     = length(var.google_client_secret) > 0
		error_message = "Google Client Secret is required"
	}
}

variable "auth_secret_key_1" {
	type = string
}
