variable "aws_access_key" {
	validation {
		condition     = length(var.aws_access_key) > 0
		error_message = "AWS Access Key is required"
	}
}

variable "aws_secret_key" {
	validation {
		condition     = length(var.aws_secret_key) > 0
		error_message = "AWS Secret Key is required"
	}
}

variable "region" {
	validation {
		condition     = length(var.region) > 0
		error_message = "Region is required"
	}
	default = "ap-south-1"
}

provider "aws" {
	access_key = var.aws_access_key
	secret_key = var.aws_secret_key
	region     = var.region
}

variable "prefix" {
	validation {
		condition     = length(var.prefix) > 0
		error_message = "Prefix is required"
	}
}

variable "root_domain" {
	validation {
		condition     = length(var.root_domain) > 0
		error_message = "Root Domain is required"
	}
}

variable "cert_manager_email" {
	validation {
		condition     = length(var.cert_manager_email) > 0
		error_message = "Cert Manager Email is required"
	}

	default = "omkar@anthaathi.co"
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
	validation {
		condition     = length(var.auth_secret_key_1) > 0
		error_message = "Auth Secret Key 1 is required"
	}
}
