require 'yapc/message'
require 'yapc/convo'

Pusher.app_id = '3984'
Pusher.key    = 'd5593d81364f0abee5b0'
Pusher.secret = 'd09cb9914ad3631c5852'

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