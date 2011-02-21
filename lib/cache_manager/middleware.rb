module CacheManager
  class Middleware
    def initialize(app)
      @app = app
    end

    def client
      @client ||= begin
        if ENV['RACK_ENV'] == 'production'
          Dalli::Client.new('localhost:11211').tap(&:stats) #stats so it'll trigger a network error if there's no memcached running
        else
          Faker.new
        end
      rescue Dalli::NetworkError
        Faker.new
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