# outputs.tf

output "alb_hostname" {
  value = data.aws_alb.main.dns_name
}

output "sns_topic" {
  value       = aws_sns_topic.billing_alert_topic.arn
  description = "Subscribe to this topic using your email to receive email alerts from the budget."
}

# output "rds_write_arn" {
#   value       = aws_db_instance.mds.arn
#   description = "Produces the arn to point read replicas at"
# }