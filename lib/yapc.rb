require 'psych'

module Yapc
  ROOT = File.join(File.dirname(__FILE__),'yapc')

  class CookieRandomizer
    NAME_HASH = Psych.load_file(File.join ROOT, 'celebs.yml')

    def initialize(app)
      @app = app
    end

    def call(env)
      env['rack.session'][:id] ||= rand.to_s
      env['rack.session'][:name] ||= NAME_HASH.keys[(rand*NAME_HASH.size).to_i]
      @app.call(env)
    end
  end

  class CacheManager
    def initialize(app)
      @app = app
    end

    def call(env)
      env['yapc.cache'] = ENV['RACK_ENV'] == 'production' ? Dalli::Client.new('localhost:11211') : self
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

  APP_ID, KEY, SECRET = if ENV['RACK_ENV'] == 'production'
      ['4085','88cbcdcb7cc0c9129051','6e9209f10b89f05f3047']
    else
      ['4086','c0025d97c7bdc1b9ce17','9054bd539770daee4b46']
    end
end

require 'yapc/message'
require 'yapc/convo'

Pusher.app_id = Yapc::APP_ID
Pusher.key    = Yapc::KEY
Pusher.secret = Yapc::SECRET