resource "aws_s3_bucket" "s3_storage" {
	bucket = "${var.prefix}-storage-deployment"

	tags = {
		Name = "${var.prefix} Deployment Bucket"
	}
}

resource "aws_cloudfront_origin_access_control" "cloudfront_s3_oac_form" {
	name                              = "CloudFront S3 OAC ${ var.prefix }"
	description                       = "Cloud Front S3 OAC"
	origin_access_control_origin_type = "s3"
	signing_behavior                  = "always"
	signing_protocol                  = "sigv4"
}

resource "aws_s3_bucket_public_access_block" "block_public_access_form" {
	block_public_acls       = true
	block_public_policy     = true
	ignore_public_acls      = true
	restrict_public_buckets = true
	bucket                  = aws_s3_bucket.s3_storage.id
}

resource "aws_s3_bucket_policy" "form-cdn-oac-bucket-policy" {
	bucket = aws_s3_bucket.s3_storage.id
	policy = data.aws_iam_policy_document.s3_bucket_policy_form.json
}

data "aws_iam_policy_document" "s3_bucket_policy_form" {
	statement {
		actions   = ["s3:GetObject"]
		resources = ["${aws_s3_bucket.s3_storage.arn}/*"]
		principals {
			type        = "Service"
			identifiers = ["cloudfront.amazonaws.com"]
		}
		condition {
			test     = "StringEquals"
			variable = "AWS:SourceArn"
			values   = [aws_cloudfront_distribution.s3_storage_cdn.arn]
		}
	}
}

resource "aws_cloudfront_distribution" "s3_storage_cdn" {
	origin {
		domain_name              = aws_s3_bucket.s3_storage.bucket_regional_domain_name
		origin_id                = aws_s3_bucket.s3_storage.id
		origin_access_control_id = aws_cloudfront_origin_access_control.cloudfront_s3_oac_form.id
	}

	custom_error_response {
		error_code         = 403
		response_code      = 200
		response_page_path = "/index.html"
	}

	aliases = [
		var.deploy_domain,
	]

	enabled             = true
	is_ipv6_enabled     = true
	default_root_object = "index.html"

	tags = {
		Name = "${var.prefix} Deployment CDN"
	}

	http_version = "http2and3"

	viewer_certificate {
		acm_certificate_arn      = aws_acm_certificate_validation.task_cert_validation_dns_record_validation.certificate_arn
		minimum_protocol_version = "TLSv1.2_2021"
		ssl_support_method       = "sni-only"
	}

	default_cache_behavior {
		target_origin_id       = aws_s3_bucket.s3_storage.id
		allowed_methods        = ["GET", "HEAD"]
		cached_methods         = ["GET", "HEAD"]
		viewer_protocol_policy = "redirect-to-https"
		compress               = true
		response_headers_policy_id = "67f7725c-6f97-4210-82d7-5512b31e9d03"

		# Default TTL is 24 hours
		cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
	}

	restrictions {
		geo_restriction {
			restriction_type = "none"
		}
	}
}

resource "aws_acm_certificate_validation" "task_cert_validation_dns_record_validation" {
	certificate_arn         = aws_acm_certificate.deployment_cert.arn
	validation_record_fqdns = [for record in aws_route53_record.form_cert_validation_dns_record : record.fqdn]
	provider                = aws.virginia
}

resource "aws_acm_certificate" "deployment_cert" {
	domain_name       = var.deploy_domain
	validation_method = "DNS"

	provider = aws.virginia

	tags = {
		Name = "Task Certificate"
	}

	lifecycle {
		create_before_destroy = true
	}
}

resource "aws_route53_record" "form_cert_validation_dns_record" {
	for_each = {
		for dvo in aws_acm_certificate.deployment_cert.domain_validation_options : dvo.domain_name => {
			name   = dvo.resource_record_name
			record = dvo.resource_record_value
			type   = dvo.resource_record_type
		}
	}

	allow_overwrite = true
	name            = each.value.name
	records         = [each.value.record]
	ttl             = 60
	type            = each.value.type
	zone_id         = var.zone_id
}

resource "aws_route53_record" "route53-form-aaaa-record" {
	zone_id = var.zone_id
	name    = var.deploy_domain
	type    = "AAAA"

	alias {
		evaluate_target_health = false
		name                   = aws_cloudfront_distribution.s3_storage_cdn.domain_name
		zone_id                = aws_cloudfront_distribution.s3_storage_cdn.hosted_zone_id
	}
}

resource "aws_route53_record" "route53-form-a-record" {
	zone_id = var.zone_id
	name    = var.deploy_domain
	type    = "A"

	alias {
		evaluate_target_health = false
		name                   = aws_cloudfront_distribution.s3_storage_cdn.domain_name
		zone_id                = aws_cloudfront_distribution.s3_storage_cdn.hosted_zone_id
	}
}
