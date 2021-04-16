# security.tf

# ALB Security Group: Edit to restrict access to the application
data "aws_security_group" "web" {
  name = "Web_sg"
}

# ALB Security Group: Edit to restrict access to the application
data "aws_security_group" "data" {
  name = "Data_sg"
}

# ALB Security Group: Edit to restrict access to the application
data "aws_security_group" "app" {
  name = "App_sg"
}

# Used in sg names so that 2 named groups from same resource may exist at once before destroying one
resource "random_id" "unique" {
  byte_length = 8
}

# Traffic to the ECS cluster should only come from the ALB
resource "aws_security_group" "ecs_tasks" {
  name        = "mds-ecs-tasks-security-group"

  description = "allow inbound access from the ALB only"
  vpc_id      = module.network.aws_vpc.id

  ingress {
    protocol        = "tcp"
    from_port       = var.configs["web"]["port"]
    to_port         = var.configs["web"]["port"]
    security_groups = [data.aws_security_group.web.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

resource "aws_security_group" "mds_db" {
  name = "mds_db-${random_id.unique.hex}"
  lifecycle {
    create_before_destroy = true
  }

  description = "mds-rds-database"
  vpc_id = module.network.aws_vpc.id

  # Only postgres in
  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    security_groups = [data.aws_security_group.app.id, aws_security_group.ecs_tasks.id]
  }

  # Allow all outbound traffic.
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

resource "aws_security_group" "mds_redis" {
  name = "mds_redis-${random_id.unique.hex}"
  lifecycle {
    create_before_destroy = true
  }

  description = "mds-elasticache-redis"
  vpc_id = module.network.aws_vpc.id

  # Only redis in
  ingress {
    from_port = 6379
    to_port = 6379
    protocol = "tcp"
    security_groups = [data.aws_security_group.app.id]
  }

  # Allow all outbound traffic.
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}