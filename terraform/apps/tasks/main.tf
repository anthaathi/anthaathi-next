module "task_static" {
	source = "../../shared/static-site"

	deploy_domain = "task.${var.base_domain}"
	prefix        = "${var.prefix}-task"
	zone_id       = var.zone_id

	providers = {
		aws          = aws
		aws.virginia = aws.virginia
	}
}
