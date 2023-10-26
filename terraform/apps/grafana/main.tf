data "kubernetes_service_v1" "istio-common-gateway" {
	metadata {
		name      = "${var.prefix}-common-gateway-istio"
		namespace = "istio-system"
	}
}

resource "helm_release" "grafana" {
	chart      = "grafana"
	name       = "grafana"
	repository = "https://grafana.github.io/helm-charts"
	namespace  = "${var.prefix}-engine"

	set {
		name  = "persistence.enabled"
		value = "true"
	}

	values = [
		templatefile("${path.module}/manifest/grafana.yaml", {
			ROOT_DOMAIN = var.root_name
		})
	]
}

resource "aws_route53_record" "dash_record_zone" {
	name       = "dash.${var.root_name}"
	type       = "CNAME"
	zone_id    = var.zone_id
	ttl        = 1600
	depends_on = [
		data.kubernetes_service_v1.istio-common-gateway,
	]
	records = [data.kubernetes_service_v1.istio-common-gateway.status.0.load_balancer.0.ingress.0.hostname]
}

resource "kubectl_manifest" "dash_http_route" {
	yaml_body = templatefile("${path.module}/manifest/http-route.yaml", {
		PREFIX      = var.prefix,
		BASE_DOMAIN = var.root_name,
	})
}
