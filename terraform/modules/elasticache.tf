# elasticach.tf

resource "aws_elasticache_cluster" "mds_redis" {
  cluster_id           = "mds-redis-cluster"
  engine               = "redis"
  node_type            = "cache.m4.large"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis3.2"
  engine_version       = "3.2.10"
  port                 = 6379
  subnet_group_name     = aws_elasticache_subnet_group.mds_redis_subnet_group.name
  security_group_ids   = [aws_security_group.mds_redis.id]

  depends_on = [aws_security_group.mds_redis]
}