module Yapc
  module Utility
    def self.included(base)
      base.instance_eval do
        attr_accessor :env

#        %w(show update create delete).each do |method|
#          define_method(method) do |env|
#            not_found
#          end
#        end
      end
    end

    def render(content, options = {})
      status = options.delete(:status) || 200
      content_type = options.delete(:type) || 'text/html'
      [status,{'Content-Type' => content_type},[content]]
    end

    def haml(code)
      Haml::Engine.new(code).render
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

    def call(_env)
      self.env = _env
      resp = case env['REQUEST_METHOD']
        when 'GET'
          show
        when 'POST'
          create
        else
          not_found
      end
      resp.is_a?(String) ? render(resp) : resp
    end
  end
end

