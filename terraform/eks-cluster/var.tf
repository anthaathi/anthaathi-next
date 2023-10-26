variable "prefix" {
	validation {
		condition     = length(var.prefix) > 0
		error_message = "Prefix must not be empty"
	}
}

variable "aws_eks_vpc_cidr" {
	default = "10.0.0.0/16"
}

variable "aws_eks_vpc_private_subnet" {
	default = [
		"10.0.1.0/24",
		"10.0.2.0/24",
		"10.0.3.0/24"
	]
}

variable "cluster_name" {
	validation {
		condition     = length(var.cluster_name) > 0
		error_message = "Cluster name is required"
	}
}

variable "aws_eks_vpc_public_subnet" {
	default = [
		"10.0.101.0/24",
		"10.0.102.0/24",
		"10.0.103.0/24"
	]
}

variable "region" {
	default = "ap-south-1"
}

variable "env" {
	default = "dev"

	validation {
		condition     = length(var.env) > 0
		error_message = "Environment is required"
	}
}

variable "aws_eks_vpc_azs" {
	default = ["ap-south-1a", "ap-south-1b", "ap-south-1c"]
	type    = list(string)
}

variable "cluster_high_available" {
	default = false
}

variable "cluster_version" {
	default = "1.27"
}

variable "base_domain" {
	validation {
		condition     = length(var.base_domain) > 0
		error_message = "Base domain is required"
	}
}

variable "cert-manager-email" {
	validation {
		condition     = length(var.cert-manager-email) > 0
		error_message = "Cert manager email is required"
	}
}

variable "zone_id" {
	validation {
		condition     = length(var.zone_id) > 0
		error_message = "Zone id is required"
	}

	description = "Route53 zone id"
}
