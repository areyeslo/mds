# cluster.tf

resource "aws_ecs_cluster" "main" {
  name               = "mds-cluster"
  capacity_providers = ["FARGATE_SPOT"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 100
  }

  tags = local.common_tags
}