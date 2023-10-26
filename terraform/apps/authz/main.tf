resource "kubernetes_config_map_v1" "oathkeeper_config" {
	metadata {
		name = "authz-grafana-config"
		namespace = "${var.prefix}-auth"
	}

	data = {
		"grafana-access-rules.yml": templatefile("${path.module}/manifest/access-rules-grafana.yaml", {
			ROOT_DOMAIN = var.root_name,
			PREFIX      = var.prefix,
		})
	}
}

resource "helm_release" "authz" {
	chart      = "oathkeeper"
	repository = "https://k8s.ory.sh/helm/charts"
	name       = "authz"
	namespace  = "${var.prefix}-auth"

	timeout = 60

	depends_on = [
		kubernetes_config_map_v1.oathkeeper_config
	]

	set {
		name = "deployment.extraVolumes[0].name"
		value = "grafana"
	}

	set {
		name = "deployment.extraVolumes[0].configMap.name"
		value = "authz-grafana-config"
	}

	set {
		name = "deployment.extraVolumeMounts[0].name"
		value = "grafana"
	}

	set {
		name = "deployment.extraVolumeMounts[0].mountPath"
		value = "/etc/secrets/authz-grafana"
	}

	set {
		name = "deployment.extraVolumeMounts[0].readOnly"
		value = true
	}

	set {
		name  = "image.tag"
		value = "v0.40.6"
	}

	set {
		name  = "maester.enabled"
		value = "false"
	}

	values = [
		templatefile("${path.module}/manifest/values.yaml", {
			ROOT_DOMAIN = var.root_name,
			PREFIX      = var.prefix,
		})
	]
}
