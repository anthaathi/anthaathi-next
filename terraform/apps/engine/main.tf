data "kubernetes_service_v1" "istio-common-gateway" {
	metadata {
		name      = "${var.prefix}-common-gateway-istio"
		namespace = "istio-system"
	}
}

resource "aws_route53_record" "auth_record_zone" {
	name       = "graphql.${var.root_name}"
	type       = "CNAME"
	zone_id    = var.zone_id
	ttl        = 1600
	depends_on = [
		data.kubernetes_service_v1.istio-common-gateway,
	]
	records = [data.kubernetes_service_v1.istio-common-gateway.status.0.load_balancer.0.ingress.0.hostname]
}

resource "kubernetes_namespace_v1" "namespace" {
	metadata {
		name = "${var.prefix}-engine"

		labels = {
			istio-injection = "enabled"
		}
	}
}

resource "kubectl_manifest" "pg_engine_cluster" {
	yaml_body = templatefile("${path.module}/manifest/pg-cluster.yml", {
		PREFIX = var.prefix,
	})
}

resource "kubernetes_secret_v1" "cluster" {
	metadata {
		name      = "${var.prefix}-engine-pg-bootstrap-secret"
		namespace = "${var.prefix}-engine"
	}

	type = "kubernetes.io/basic-auth"

	data = {
		password = random_password.server.result,
		username = "engine_app"
	}
}

resource "random_password" "server" {
	length  = 16
	special = true
}

resource "kubernetes_secret_v1" "engine_db_connect" {
	metadata {
		name      = "${var.prefix}-engine-db-secrets"
		namespace = "${var.prefix}-engine"
	}

	data = {
		DB_URL = "postgresql://engine_app:${urlencode(random_password.server.result)}@${var.prefix}-engine-pg-cluster-rw:5432/engine_db"
	}
}
