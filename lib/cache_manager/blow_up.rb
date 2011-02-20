module CacheManager
  module BlowUp
    def self.call(env)
      env[MEMCACHE_KEY].flush if Rack::Request.new(env).params.with_indifferent_access[:reset_code] == SECRET
    end
  end
end