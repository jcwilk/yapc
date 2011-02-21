module CacheManager
  class Middleware
    def initialize(app)
      @app = app
    end

    def client
      @client ||= begin
        c=Dalli::Client.new('localhost:11211')
        if c.stats.values.any?
          c
        else
          Faker.new
        end
      end
    end

    def call(env)
      env[MEMCACHE_KEY] = client
      @app.call(env)
    end

    class Faker
      def method_missing(*args)
        if block_given?
          yield
        else
          nil
        end
      end
    end
  end
end