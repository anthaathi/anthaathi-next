module "aws_eks_cluster" {
	source             = "./eks-cluster"
	cluster_name       = "anthaathi-eks-${var.prefix}"
	prefix             = var.prefix
	base_domain        = var.root_domain
	cert-manager-email = var.cert_manager_email
	zone_id            = module.anthaathi_apps.zone_id
}

module "anthaathi_apps" {
	source = "./apps"

	root_domain = var.root_domain
	prefix      = var.prefix

	google_client_id     = var.google_client_id
	google_client_secret = var.google_client_secret

	auth_secret_key_1 = var.auth_secret_key_1

	providers = {
		aws          = aws
		kubectl      = kubectl
		kubernetes   = kubernetes
		helm         = helm
		aws.virginia = aws.virginia
	}

	depends_on = [
		module.aws_eks_cluster.cluster_name
	]
}

provider "kubectl" {
	apply_retry_count      = 5
	host                   = module.aws_eks_cluster.cluster_endpoint
	cluster_ca_certificate = base64decode(module.aws_eks_cluster.cluster_certificate_authority_data)
	load_config_file       = false

	exec {
		api_version = "client.authentication.k8s.io/v1beta1"
		command     = "aws"
		# This requires the awscli to be installed locally where Terraform is executed
		args        = ["eks", "get-token", "--cluster-name", module.aws_eks_cluster.cluster_name]
	}
}

provider "kubernetes" {
	host                   = module.aws_eks_cluster.cluster_endpoint
	cluster_ca_certificate = base64decode(module.aws_eks_cluster.cluster_certificate_authority_data)

	exec {
		api_version = "client.authentication.k8s.io/v1beta1"
		command     = "aws"
		# This requires the awscli to be installed locally where Terraform is executed
		args        = ["eks", "get-token", "--cluster-name", module.aws_eks_cluster.cluster_name]
	}
}

provider "helm" {
	kubernetes {
		host                   = module.aws_eks_cluster.cluster_endpoint
		cluster_ca_certificate = base64decode(module.aws_eks_cluster.cluster_certificate_authority_data)

		exec {
			api_version = "client.authentication.k8s.io/v1beta1"
			command     = "aws"
			# This requires the awscli to be installed locally where Terraform is executed
			args        = ["eks", "get-token", "--cluster-name", module.aws_eks_cluster.cluster_name]
		}
	}
}

provider "aws" {
	alias  = "virginia"
	region = "us-east-1"
}
