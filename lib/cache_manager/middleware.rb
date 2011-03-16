module CacheManager
  class Middleware
    def initialize(app)
      @app = app
    end

    def client
      @client ||= begin
        if true #TODO: check if memcache is running? yaml?
          Faker.new
        else
          Dalli::Client.new('localhost:11211')
        end
      end
    end

    def call(env)
      env[MEMCACHE_KEY] = client
      @app.call(env)
    end

    #Quickie class to match -very few- but just enough memcache client methods
    #Uses memory store instead of memcache
    class Faker
      #TODO: Mutex that shit
      cattr_accessor :cache

      def initialize(ignored = nil)
        self.class.cache ||= {}
      end

      def fetch(key)
        val = self.class.cache[key]
        if val.nil? && block_given?
          val = yield
          self.class.cache[key] = val
        end
        val
      end

      def flush
        self.class.cache = {}
        nil
      end
    end
  end
end