require 'yapc/message'
require 'yapc/convo'

module Yapc
  class CookieRandomizer
    def initialize(app)
      @app = app
    end

    def call(env)
      env['rack.session'][:id] ||= rand.to_s
      @app.call(env)
    end
  end
end

module Yapc
  APP_ID, KEY, SECRET = if ENV['RACK_ENV'] == 'production'
      ['4085','88cbcdcb7cc0c9129051','6e9209f10b89f05f3047']
    else
      ['4086','c0025d97c7bdc1b9ce17','9054bd539770daee4b46']
    end

end
Pusher.app_id = Yapc::APP_ID
Pusher.key    = Yapc::KEY
Pusher.secret = Yapc::SECRET