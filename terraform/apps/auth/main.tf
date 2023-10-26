data "kubernetes_service_v1" "istio-common-gateway" {
	metadata {
		name      = "${var.prefix}-common-gateway-istio"
		namespace = "istio-system"
	}
}

resource "aws_route53_record" "auth_record_zone" {
	name       = "auth.${var.root_name}"
	type       = "CNAME"
	zone_id    = var.zone_id
	ttl        = 1600
	depends_on = [
		data.kubernetes_service_v1.istio-common-gateway,
	]
	records = [data.kubernetes_service_v1.istio-common-gateway.status.0.load_balancer.0.ingress.0.hostname]
}

resource "kubernetes_namespace_v1" "auth_name" {
	metadata {
		name = "${var.prefix}-auth"

		labels = {
			istio-injection = "enabled"
		}
	}
}

resource "kubectl_manifest" "auth_http_route" {
	yaml_body = templatefile("${path.module}/manifest/auth-http-route.yml", {
		PREFIX      = var.prefix,
		BASE_DOMAIN = var.root_name,
	})
}

resource "random_password" "server" {
	length  = 16
	special = true
}

resource "random_password" "kratos_secret" {
	length  = 24
	lower   = true
	special = true
}

resource "random_password" "kratos_cookie_secret" {
	length  = 24
	lower   = true
	special = true
}

resource "kubernetes_secret_v1" "cluster" {
	metadata {
		name      = "${var.prefix}-auth-pg-bootstrap-secret"
		namespace = "${var.prefix}-auth"
	}

	type = "kubernetes.io/basic-auth"

	data = {
		password = random_password.server.result,
		username = "kratos_auth"
	}
}

resource "kubectl_manifest" "pg_auth_cluster" {
	yaml_body = templatefile("${path.module}/manifest/auth-pg-cluster.yaml", {
		PREFIX = var.prefix,
	})
}

resource "kubectl_manifest" "auth_frontend_http_route" {
	yaml_body = templatefile("${path.module}/manifest/auth-frontend-http-route.yml", {
		PREFIX      = var.prefix,
		BASE_DOMAIN = var.root_name,
	})
}

resource "aws_ses_domain_identity" "email_domain" {
	domain = var.root_name
}

resource "aws_route53_record" "website_amazonses_verification_record" {
	zone_id = var.zone_id
	name    = "_amazonses.${aws_ses_domain_identity.email_domain.id}"
	type    = "TXT"
	ttl     = "600"
	records = [aws_ses_domain_identity.email_domain.verification_token]
}

data "aws_region" "current" {}

resource "helm_release" "kratos" {
	chart      = "kratos"
	name       = "kratos"
	repository = "https://k8s.ory.sh/helm/charts"
	namespace  = "${var.prefix}-auth"
	values     = [
		templatefile("${path.module}/manifest/kratos.yaml", {
			PREFIX                  = var.prefix,
			SECRET_KEY_1            = var.auth_secret_key_1,
			BASE_DOMAIN             = var.root_name,
			GOOGLE_CLIENT_ID        = var.google_client_id,
			GOOGLE_CLIENT_SECRET    = var.google_client_secret,
			SMTP_CONNECTION_URI     = "smtp://${aws_iam_access_key.smtp_user.id}:${aws_iam_access_key.smtp_user.ses_smtp_password_v4}@email-smtp.${ data.aws_region.current.name }.amazonaws.com:587",
			// TODO: FIX SSL
			DATABASE_CONNECTION_URL = "postgres://kratos_auth:${urlencode(random_password.server.result)}@${var.prefix}-auth-pg-cluster-rw:5432/kratos_auth?sslmode=disable&sslcert=/etc/postgresql-tls/ca.crt&sslkey=/etc/postgresql-tls/ca.key",
		})
	]
}

variable "google_client_id" {
	type = string
}

variable "google_client_secret" {
	type = string
}

resource "aws_iam_user" "smtp_user" {
	name = "${var.prefix}-smtp_user"
}

resource "aws_iam_access_key" "smtp_user" {
	user = aws_iam_user.smtp_user.name
}

data "aws_iam_policy_document" "ses_sender" {
	statement {
		actions   = ["ses:SendRawEmail"]
		resources = ["*"]
	}
}

resource "aws_iam_policy" "ses_sender" {
	name        = "${var.prefix}_ses_sender"
	description = "Allows sending of e-mails via Simple Email Service"
	policy      = data.aws_iam_policy_document.ses_sender.json
}

resource "aws_iam_user_policy_attachment" "ses-attach" {
	user       = aws_iam_user.smtp_user.name
	policy_arn = aws_iam_policy.ses_sender.arn
}
