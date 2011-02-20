module CacheManager
  class Middleware
    def initialize(app)
      @app = app
    end

    def call(env)
      env[MEMCACHE_KEY] = ENV['RACK_ENV'] == 'production' ? Dalli::Client.new('localhost:11211') : self
      @app.call(env)
    end

    def method_missing(*args)
      if block_given?
        yield
      else
        nil
      end
    end
  end
end