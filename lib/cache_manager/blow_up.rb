module CacheManager
  module BlowUp
    def self.call(env)
      code = if Rack::Request.new(env).params.with_indifferent_access[:reset_code] == API_SECRET
        env[MEMCACHE_KEY].flush
        200
      else
        401
      end
      [code,{'Content-Type' => 'text/plain'},'']
    end
  end
end