# db.tf

resource "aws_db_instance" "mds_db" {
  allocated_storage    = var.rds_gb_storage
  max_allocated_storage  = var.rds_gb_storage*2
  storage_type         = "gp2"
  storage_encrypted    = true
  engine               = var.rds_engine
  engine_version       = var.rds_engine_version
  instance_class       = var.rds_instance_class
  name                 = var.rds_db_name
  username             = var.rds_username
  password             = var.rds_password
  port                 = var.rds_port
  # parameter_group_name = "mds_db.${var.rds_engine}${var.rds_engine_version}" #can specify groups containing psql config
  backup_retention_period = 30
  apply_immediately = true
  skip_final_snapshot = true
  # monitoring_interval = 10 # requires monitoring arn

  db_subnet_group_name     = aws_db_subnet_group.mds_db_subnet_group.name
  vpc_security_group_ids   = [aws_security_group.mds_db.id]

  depends_on = [aws_security_group.mds_db]
}