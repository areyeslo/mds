resource "aws_ecs_task_definition" "api" {
  count                    = local.create_ecs_service
  family                   = "${var.configs["api"]["container_name"]}-task"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.mds_app_container_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.configs["api"]["cpu"]
  memory                   = var.configs["api"]["memory"]
  tags                     = local.common_tags
  container_definitions = jsonencode([
    {
      essential   = true
      name        = var.configs["api"]["container_name"]
      image       = "${var.ecr_arn}${var.configs["api"]["ecr_repo"]}:${var.image_tag}"
      networkMode = "awsvpc"
      portMappings = [
        {
          protocol      = "tcp"
          containerPort = var.configs["api"]["port"]
          hostPort      = var.configs["api"]["port"]
        }
      ]
      environment = [
        {
          name  = "AWS_REGION",
          value = var.aws_region
        }
      ]
      environmentFiles = [
        {
          value = "arn:aws:s3:::${var.env_s3}/core_backend_${var.target_env}.env",
          type  = "s3"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-create-group  = "true"
          awslogs-group         = "/ecs/${var.configs["api"]["container_name"]}"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
      mountPoints = []
      volumesFrom = []
    }
  ])
}

resource "aws_ecs_service" "api" {
  count                             = local.create_ecs_service
  name                              = "${var.configs["api"]["container_name"]}-service" # pipeline depends on this naming schema
  cluster                           = aws_ecs_cluster.main.id
  task_definition                   = aws_ecs_task_definition.api[count.index].arn
  desired_count                     = var.configs["api"]["replicas"]
  enable_ecs_managed_tags           = true
  propagate_tags                    = "TASK_DEFINITION"
  health_check_grace_period_seconds = 60
  wait_for_steady_state             = false # Setting to true ensures task is successful, but causes github runner to wait
  platform_version                  = "1.4.0"
  minimumHealthyPercent             = 100
  maximumHealthyPercent             = 150

  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 100
  }


  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = module.network.aws_subnet_ids.app.ids
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.app.id
    container_name   = var.configs["api"]["container_name"]
    container_port   = var.configs["api"]["port"]
  }

  depends_on = [data.aws_alb_listener.front_end, aws_iam_role_policy_attachment.ecs_task_execution_role]

  tags = local.common_tags
}
