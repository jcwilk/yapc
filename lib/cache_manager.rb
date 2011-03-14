module CacheManager
  MEMCACHE_KEY = 'cache_manager.memcache'
  API_SECRET = '123k4k2o3kl12l123d0'

  autoload :BlowUp, 'cache_manager/blow_up'
  autoload :Middleware, 'cache_manager/middleware'
end

