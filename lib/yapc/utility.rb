module Yapc
  module Utility
    def self.included(base)
      base.send :include, InstanceMethods
      base.send :extend,  ClassMethods
    end

    module InstanceMethods
      attr_accessor :env, :response

      def render(content, options = {})
        status = options.delete(:status) || 200
        content_type = options.delete(:type) || 'text/html'
        [status,{'Content-Type' => content_type},[content]]
      end

      def haml(action)
        if action.is_a?(Symbol)
          cache.fetch(action) do
            haml File.read(File.join(YAPC_ROOT,"views/#{action}.haml"))
          end
        else
          Haml::Engine.new(action).render
        end
      end

      def not_found
        render 'Not Found', :status => 404, :type => 'text/plain'
      end

      def request
        @request ||= Rack::Request.new(env)
      end

      def params
        request.params.with_indifferent_access
      end

      def cache
        env[CacheManager::MEMCACHE_KEY]
      end

      def session
        env['rack.session']
      end

      def initialize(_env)
        self.env = _env
        resp = case env['REQUEST_METHOD']
          when 'GET'
            show
          when 'POST'
            create
          when 'PUT'
            update
          else
            not_found
        end
        self.response = resp.is_a?(String) ? render(resp) : resp
      end
    end

    module ClassMethods
      def call(_env)
        new(_env).response
      end
    end
  end
end

