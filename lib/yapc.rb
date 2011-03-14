require 'yaml'

module Yapc
  YAPC_ROOT = File.join(File.dirname(__FILE__),'yapc')
  PUSH_APP_HOST = ENV['RACK_ENV'] == 'production' ? 'pushserver.duostack.net' : 'development.pushserver.duostack.net:3000'

  class CookieRandomizer
    NAME_HASH = YAML.load_file(File.join YAPC_ROOT, 'celebs.yml')

    def initialize(app)
      @app = app
    end

    def call(env)
      env['rack.session'][:id] ||= rand.to_s
      env['rack.session'][:name] ||= NAME_HASH.keys[(rand*NAME_HASH.size).to_i]
      @app.call(env)
    end
  end

  autoload :Message, 'yapc/message'
  autoload :Convo, 'yapc/convo'
end