locals {
  common           = yamldecode(file(find_in_parent_folders("common.yaml")))
  tfc_hostname     = local.common["tfc_hostname"]
  tfc_organization = local.common["tfc_organization"]
  project          = local.common["license_plate"]
  service_name     = local.common["service_name"]
  environment      = reverse(split("/", get_terragrunt_dir()))[0]
  ecr_arn          = get_env("ECR_ARN", "")
  ecr_tag          = get_env("ECR_TAG", "dev")
  rds_username     = get_env("AWS_RDS_ADMIN_USER", "")
  rds_password     = get_env("AWS_RDS_ADMIN_PASSWORD", "")
  env_bucket       = local.common["env_buckets"][local.environment]
  configs          = local.common["configs"][local.environment]
}

generate "remote_state" {
  path      = "backend.tf"
  if_exists = "overwrite"
  contents  = <<EOF
terraform {
  backend "remote" {
    hostname = "${local.tfc_hostname}"
    organization = "${local.tfc_organization}"
    workspaces {
      name = "${local.project}-${local.environment}"
    }
  }
}
EOF
}

generate "tfvars" {
  path              = "terragrunt.auto.tfvars"
  if_exists         = "overwrite"
  disable_signature = true
  contents          = <<-EOF
ecr_arn = "${local.ecr_arn}"
image_tag = "${local.ecr_tag}"
service_names = ["${local.service_name}"]
rds_username = "${local.rds_username}"
rds_password = "${local.rds_password}"
env_s3 = "${local.env_bucket}"
configs = ${jsonencode(local.configs)}
EOF
}
