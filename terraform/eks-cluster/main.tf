module "eks" {
	source  = "terraform-aws-modules/eks/aws"
	version = "19.15.3"

	cluster_name    = "${var.prefix}-eks"
	cluster_version = var.cluster_version

	cluster_endpoint_private_access = true
	cluster_endpoint_public_access  = true

	vpc_id                   = module.vpc.vpc_id
	subnet_ids               = module.vpc.private_subnets
	control_plane_subnet_ids = module.vpc.intra_subnets

	cluster_security_group_additional_rules = {
		ingress_nodes_ephemeral_ports_tcp = {
			description                = "Nodes on ephemeral ports"
			protocol                   = "tcp"
			from_port                  = 1025
			to_port                    = 65535
			type                       = "ingress"
			source_node_security_group = true
		}
	}

	manage_aws_auth_configmap = true
	aws_auth_roles            = []

	node_security_group_enable_recommended_rules = true

	node_security_group_additional_rules = merge(
		local.ingress_rules,
		local.egress_rules,
		// TODO: THIS NEEDS TO BE REMOVED IN FUTURE
		{
			ingress_self_all = {
				description = "Node to node all ports/protocols"
				protocol    = "-1"
				from_port   = 0
				to_port     = 0
				type        = "ingress"
				self        = true
			}
		}
	)

	enable_irsa = true

	eks_managed_node_group_defaults = {
		disk_size = 50
	}

	cluster_addons = {
		coredns = {
			most_recent       = true
			resolve_conflicts = "OVERWRITE"
		}
		vpc-cni = {
			most_recent       = true
			resolve_conflicts = "OVERWRITE"
		}
		kube-proxy = {
			most_recent       = true
			resolve_conflicts = "OVERWRITE"
		}
		aws-ebs-csi-driver = {
			most_recent              = true
			service_account_role_arn = module.ebs_csi_irsa_role.iam_role_arn
		}
	}

	cluster_enabled_log_types = []

	eks_managed_node_groups = {
		general = {
			desired_size = 1
			min_size     = 1
			max_size     = 10

			labels = {
				role = "general"
			}

			instance_types = ["t4g.large"]
			ami_type       = "AL2_ARM_64"
			capacity_type  = "ON_DEMAND"
		}

		spotAmd64 = {
			desired_size = 1
			min_size     = 1
			max_size     = 10

			labels = {
				role = "spot"
				arch = "amd64"
			}

			taints = [
				{
					key    = "spotInstanceAmd64"
					value  = "true"
					effect = "NO_SCHEDULE"
				}
			]

			update_config = {
				max_unavailable_percentage = 33
			}

			ami_type       = "AL2_x86_64"
			instance_types = ["t3.medium"]
			capacity_type  = "SPOT"
		}

		spot = {
			desired_size = 1
			min_size     = 1
			max_size     = 10

			labels = {
				role = "spot"
				arch = "arm64"
			}

			taints = [
				{
					key    = "spotInstance"
					value  = "true"
					effect = "NO_SCHEDULE"
				}
			]

			update_config = {
				max_unavailable_percentage = 33
			}

			ami_type       = "AL2_ARM_64"
			instance_types = ["t4g.large"]
			capacity_type  = "SPOT"
		}
	}

	tags = {
		Name                     = "EKS Cluster"
		Environment              = var.env
		Cluster                  = var.cluster_name
		"karpenter.sh/discovery" = var.cluster_name
	}
}

provider "kubernetes" {
	host                   = module.eks.cluster_endpoint
	cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)

	exec {
		api_version = "client.authentication.k8s.io/v1beta1"
		command     = "aws"
		# This requires the awscli to be installed locally where Terraform is executed
		args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
	}
}

provider "helm" {
	kubernetes {
		host                   = module.eks.cluster_endpoint
		cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)

		exec {
			api_version = "client.authentication.k8s.io/v1beta1"
			command     = "aws"
			# This requires the awscli to be installed locally where Terraform is executed
			args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
		}
	}
}

provider "kubectl" {
	apply_retry_count      = 5
	host                   = module.eks.cluster_endpoint
	cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
	load_config_file       = false

	exec {
		api_version = "client.authentication.k8s.io/v1beta1"
		command     = "aws"
		# This requires the awscli to be installed locally where Terraform is executed
		args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
	}
}

module "ebs_csi_irsa_role" {
	source = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"

	role_name             = "${var.cluster_name}-ebs-csi"
	attach_ebs_csi_policy = true

	oidc_providers = {
		ex = {
			provider_arn               = module.eks.oidc_provider_arn
			namespace_service_accounts = ["kube-system:ebs-csi-controller-sa"]
		}
	}
}

data "aws_availability_zones" "available" {}

data "aws_ecrpublic_authorization_token" "token" {
	provider = aws.virginia
}

locals {
	istio_ports = [
		{
			description = "Envoy admin port / outbound"
			from_port   = 15000
			to_port     = 15001
		},
		{
			description = "Debug port"
			from_port   = 15004
			to_port     = 15004
		},
		{
			description = "Envoy inbound"
			from_port   = 15006
			to_port     = 15006
		},
		{
			description = "HBONE mTLS tunnel port / secure networks XDS and CA services (Plaintext)"
			from_port   = 15008
			to_port     = 15010
		},
		{
			description = "XDS and CA services (TLS and mTLS)"
			from_port   = 15012
			to_port     = 15012
		},
		{
			description = "Control plane monitoring"
			from_port   = 15014
			to_port     = 15014
		},
		{
			description = "Webhook container port, forwarded from 443"
			from_port   = 15017
			to_port     = 15017
		},
		{
			description = "Merged Prometheus telemetry from Istio agent, Envoy, and application, Health checks"
			from_port   = 15020
			to_port     = 15021
		},
		{
			description = "DNS port"
			from_port   = 15053
			to_port     = 15053
		},
		{
			description = "Envoy Prometheus telemetry"
			from_port   = 15090
			to_port     = 15090
		},
		{
			description = "aws-load-balancer-controller"
			from_port   = 9443
			to_port     = 9443
		},
		{
			description = "HBONE port for secure networks"
			from_port   = 15009
			to_port     = 15009
		},
	]

	ingress_rules = {
		for ikey, ivalue in local.istio_ports :
		"${ikey}_ingress" => {
			description = ivalue.description
			protocol    = "tcp"
			from_port   = ivalue.from_port
			to_port     = ivalue.to_port
			type        = "ingress"
			self        = true
		}
	}

	egress_rules = {
		for ekey, evalue in local.istio_ports :
		"${ekey}_egress" => {
			description = evalue.description
			protocol    = "tcp"
			from_port   = evalue.from_port
			to_port     = evalue.to_port
			type        = "egress"
			self        = true
		}
	}
}

module "vpc" {
	source  = "terraform-aws-modules/vpc/aws"
	version = "5.0.0"

	name = "${var.prefix}-eks-vpc"
	cidr = var.aws_eks_vpc_cidr

	azs = var.aws_eks_vpc_azs

	private_subnets = var.aws_eks_vpc_private_subnet
	public_subnets  = var.aws_eks_vpc_public_subnet

	enable_nat_gateway = true

	single_nat_gateway     = var.cluster_high_available ? false : true
	one_nat_gateway_per_az = var.cluster_high_available ? true : false

	enable_dns_hostnames = true
	enable_dns_support   = true

	tags = {
		Name        = "EKS VPC For ${ var.prefix }"
		Environment = var.env
		Cluster     = var.cluster_name
	}
}

### Extra tools

resource "helm_release" "istio_base" {
	name             = "istio-base"
	version          = "1.18.1"
	repository       = "https://istio-release.storage.googleapis.com/charts"
	chart            = "base"
	namespace        = "istio-system"
	create_namespace = true
}

resource "helm_release" "istiod" {
	name       = "istiod"
	version    = "1.18.1"
	repository = "https://istio-release.storage.googleapis.com/charts"
	chart      = "istiod"
	namespace  = "istio-system"
	wait       = true

	depends_on = [
		helm_release.istio_base
	]
}

resource "helm_release" "postgres_operator" {
	chart            = "cloudnative-pg"
	name             = "cnpg"
	repository       = "https://cloudnative-pg.github.io/charts"
	namespace        = "cnpg-system"
	create_namespace = true
}

provider "aws" {
	alias  = "virginia"
	region = "us-east-1"
}

resource "aws_security_group_rule" "allow_sidecar_injection" {
	description = "Webhook container port, From Control Plane"
	protocol    = "tcp"
	type        = "ingress"
	from_port   = 15017
	to_port     = 15017

	security_group_id        = module.eks.node_security_group_id
	source_security_group_id = module.eks.cluster_primary_security_group_id
}

module "cert_manager" {
	source = "terraform-iaac/cert-manager/kubernetes"

	cluster_issuer_email                   = var.cert-manager-email
	cluster_issuer_name                    = "${var.prefix}-cert-manager-global"
	cluster_issuer_private_key_secret_name = "${var.prefix}-cert-manager-private-key"

	certificates = {
		"common-certificate" = {
			dns_names = [
				"auth.${var.base_domain}",
				"graphql.${var.base_domain}",
				"task.${var.base_domain}",
				"dash.${var.base_domain}"
			]
			namespace   = "istio-system"
			secret_name = "common-tls"

		}
	}

	additional_set = [
		{
			name  = "extraArgs",
			value = "{--dns01-recursive-nameservers-only,--dns01-recursive-nameservers=\"8.8.8.8:53\"}"
		}
	]

	solvers = [
		{
			dns01 = {
				route53 = {
					region = var.region

					accessKeyIDSecretRef = {
						name = kubernetes_secret.cert_manager_secret.metadata.0.name
						key  = "access_key"
					}

					secretAccessKeySecretRef = {
						name = kubernetes_secret.cert_manager_secret.metadata.0.name
						key  = "secret_key"
					}

					hostedZoneID = var.zone_id
				}
			},
			selector = {
				dnsZones = [
					var.base_domain
				]
			}
		}
	]
}

resource "kubernetes_secret" "cert_manager_secret" {
	metadata {
		name      = "${var.prefix}-cert-manager-aws-credentials"
		namespace = module.cert_manager.namespace
	}

	data = {
		access_key = aws_iam_access_key.cert_manager_access_key.id
		secret_key = aws_iam_access_key.cert_manager_access_key.secret
	}
}

resource "aws_iam_access_key" "cert_manager_access_key" {
	user       = aws_iam_user.cert_manager_user.name
	depends_on = [aws_iam_role_policy_attachment.cert_manager_attachment]
}

resource "aws_iam_user" "cert_manager_user" {
	name = "${var.prefix}-cert-manager-user"

	depends_on = [
		aws_iam_role_policy_attachment.cert_manager_attachment,
	]
}

resource "aws_iam_role_policy_attachment" "cert_manager_attachment" {
	role       = aws_iam_role.cert_manager_role.name
	policy_arn = aws_iam_policy.cert_manager_policy.arn
}

resource "aws_iam_role" "cert_manager_role" {
	name               = "${var.prefix}-cert-manager-role"
	assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_user_policy_attachment" "cert_manager_role" {
	policy_arn = aws_iam_policy.cert_manager_policy.arn
	user       = aws_iam_user.cert_manager_user.name
}

resource "aws_iam_policy" "cert_manager_policy" {
	name   = "${var.prefix}-cert-manager-policy"
	policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "route53:GetChange",
        "route53:ListHostedZones",
        "route53:ChangeResourceRecordSets"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}
