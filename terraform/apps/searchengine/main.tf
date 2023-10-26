resource "helm_release" "opendashboard" {
  chart      = "opensearch"
  name       = "opensearch"
  namespace  = "${var.prefix}-engine"
  repository = "https://opensearch-project.github.io/helm-charts"

  set {
    name  = "securityConfig.enabled"
    value = "false"
    type  = "auto"
  }

  set {
    name  = "singleNode"
    value = "false"
  }

  values = [
    templatefile("${path.module}/manifest/opensearch.yaml", {})
  ]
}

resource "kubernetes_config_map_v1" "logstash_config" {
  metadata {
    name      = "logstash-config"
    namespace = "${var.prefix}-engine"
  }

  data = {
    "logstash.yml" : file("${path.module}/manifest/pipelines.yml")
  }
}

resource "kubernetes_config_map_v1" "logstash_config_pipelines" {
  metadata {
    name      = "logstash-config-pipelines"
    namespace = "${var.prefix}-engine"
  }

  data = {
    "task.conf" : file("${path.module}/manifest/task.conf")
    "user.conf" : file("${path.module}/manifest/user.conf")
  }
}

data "kubernetes_secret_v1" "db_secret" {
  metadata {
    name = "${var.prefix}-engine-db-secrets"
    namespace = "${var.prefix}-engine"
  }
}


data "kubernetes_secret_v1" "db_secret_user" {
  metadata {
    name = "${var.prefix}-engine-pg-bootstrap-secret"
    namespace = "${var.prefix}-engine"
  }
}

resource "kubernetes_secret_v1" "logstash_env_secrets" {
  metadata {
    name = "logstash-secret"
    namespace = "${var.prefix}-engine"
  }

  data = {
    DB_WORKBENCH_URL: "postgresql://${var.prefix}-engine-pg-cluster-r:5432/engine_db"
    OPENSEARCH_ENDPOINT: "http://opensearch-cluster-master:9200"
    DB_WORKBENCH_USER: data.kubernetes_secret_v1.db_secret_user.data.username
    DB_WORKBENCH_PASSWORD: data.kubernetes_secret_v1.db_secret_user.data.password
  }
}
