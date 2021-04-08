# network.tf

module "network" {
  source      = "git::https://github.com/BCDevOps/terraform-octk-aws-sea-network-info.git//?ref=master"
  environment = var.target_env
}

resource "aws_db_subnet_group" "mds_db_subnet_group" {
  name       = "mds_api_group"
  subnet_ids = module.network.aws_subnet_ids.data.ids

  tags = local.common_tags
}

resource "aws_elasticache_subnet_group" "mds_redis_subnet_group" {
  name       = "mds-redis-group"
  subnet_ids = module.network.aws_subnet_ids.data.ids
}