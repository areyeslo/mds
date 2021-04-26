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

variable "ecr_arn" {
  description = "The base URI of the ECR for looking up image repos"
  type = string
}

variable "health_check_path" {
  default = "/"
}

variable "budget_amount" {
  description = "The amount of spend for the budget. Example: enter 100 to represent $100"
  default     = "600.0"
}

variable "budget_tag" {
  description = "The Cost Allocation Tag that will be used to build the monthly budget. "
  default     = "Project=MDS Frontend Spike"
}

variable "common_tags" {
  description = "Common tags for created resources"
  default = {
    Application = "MDS"
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
  default = "9.6"
}

variable "rds_instance_class" {
  description = "Database instance type, note that max_connections is tied to memory of instance class according to: LEAST({DBInstanceClassMemory/9531392}, 5000)"
  default = "db.m5.large"
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

variable "configs" {
  description = "Contains a mapping of service configurations"
}

variable "storage_buckets" {
  description = "Contains a list of s3 buckets for this workspace"
}