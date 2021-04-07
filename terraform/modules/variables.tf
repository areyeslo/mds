# variables.tf

variable "slug" {
  description = "acronym of project"
  default     = "mds"
}

variable "target_env" {
  description = "AWS workload account env (e.g. dev, test, prod, sandbox, unclass)"
}

variable "image_tag" {
  description = "defines which image will be pulled for services"
}

variable "target_aws_account_id" {
  description = "AWS workload account id"
}

variable "aws_region" {
  description = "The AWS region things are created in"
  default     = "ca-central-1"
}

variable "ecs_task_execution_role_name" {
  description = "ECS task execution role name"
  default     = "mdsEcsTaskExecutionRole"
}

variable "ecs_auto_scale_role_name" {
  description = "ECS auto scale role Name"
  default     = "mdsEcsAutoScaleRole"
}

variable "az_count" {
  description = "Number of AZs to cover in a given region"
  default     = "2"
}

variable "app_name" {
  description = "Name of the application"
  type        = string
  default     = "minesdigitalservices"
}

variable "ecr_arn" {
  description = "The base URI of the ECR for looking up image repos"
  type = string
}

variable "mds_web_repo" {
  description = "Specifies the repo to reference for mds-web images"
  type        = string
  default     = "mds-web"
}

variable "app_port" {
  description = "Port exposed by the docker image to redirect traffic to"
  default     = 80
}

variable "app_count" {
  description = "Number of docker containers to run"
  default     = 2
}

variable "container_name" {
  description = "Container name"
  default     = "app"
}

variable "health_check_path" {
  default = "/"
}

variable "fargate_cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = 2048
}

variable "fargate_memory" {
  description = "Fargate instance memory to provision (in MiB)"
  default     = 4096
}

variable "budget_amount" {
  description = "The amount of spend for the budget. Example: enter 100 to represent $100"
  default     = "100.0"
}

variable "budget_tag" {
  description = "The Cost Allocation Tag that will be used to build the monthly budget. "
  default     = "Project=MDS Frontend Spike"
}

variable "common_tags" {
  description = "Common tags for created resources"
  default = {
    Application = "MDS Spike"
  }
}

variable "env_s3" {
  description = "Bucket containing environment variables for environment to be deployed"
  type     = string
}

variable "service_names" {
  description = "List of service names to use as subdomains"
  default     = ["minesdigitalservices"]
  type        = list(string)
}

variable "alb_name" {
  description = "Name of the internal alb"
  default     = "default"
  type        = string
}

variable "rds_gb_storage" {
  description = ""
  default = 5
}

variable "rds_engine" {
  description = "Database engine to use"
  default = "postgres"
}

variable "rds_engine_version" {
  description = "What version of the engine to use (IAM auth supported only on <=12.x)"
  default = "13"
}

variable "rds_instance_class" {
  description = "Database instance type"
  default = "db.m6g.large"
}

variable "rds_db_name" {
  description = "Name of the database"
  default = "mds"
}

variable "rds_username" {
  description = "Name of the user for the database"
  type = string
}

variable "rds_password" {
  description = "Basic auth for the database"
  type = string
}

variable "rds_port" {
  description = "Port to serve db on"
  default = 5432
}