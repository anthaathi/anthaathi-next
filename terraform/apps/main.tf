module "grafana" {
	source = "./grafana"

	zone_id   = aws_route53_zone.root_zone.zone_id
	prefix    = var.prefix
	root_name = var.root_domain
}

module "authz" {
	source    = "./authz"
	prefix    = var.prefix
	root_name = var.root_domain
	zone_id   = aws_route53_zone.root_zone.zone_id
}

module "searchengine" {
	source = "./searchengine"
	prefix = var.prefix
}

module "auth" {
	source = "./auth"

	zone_id   = aws_route53_zone.root_zone.zone_id
	root_name = var.root_domain
	prefix    = var.prefix

	google_client_id     = var.google_client_id
	google_client_secret = var.google_client_secret

	providers = {
		aws        = aws
		kubectl    = kubectl
		kubernetes = kubernetes
		helm       = helm
	}

	auth_secret_key_1 = var.auth_secret_key_1

	depends_on = [
		kubectl_manifest.auth_gateway
	]
}

module "engine" {
	source = "./engine"

	providers = {
		aws        = aws
		kubectl    = kubectl
		kubernetes = kubernetes
		helm       = helm
	}

	depends_on = [
		kubectl_manifest.auth_gateway
	]

	prefix    = var.prefix
	root_name = var.root_domain
	zone_id   = aws_route53_zone.root_zone.zone_id
}

resource "aws_route53_zone" "root_zone" {
	name    = var.root_domain
	comment = "Managed by Terraform"

	tags = {
		Terraform = "true"
	}
}

resource "kubectl_manifest" "auth_gateway" {
	yaml_body = templatefile("${path.module}/manifest/gateway.yml", {
		PREFIX = var.prefix,
	})
}

module "tasks" {
	source      = "./tasks"
	base_domain = var.root_domain
	prefix      = var.prefix
	zone_id     = aws_route53_zone.root_zone.zone_id

	providers = {
		aws          = aws
		aws.virginia = aws.virginia
	}
}
