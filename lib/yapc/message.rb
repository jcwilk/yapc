require 'yapc/utility'
require 'digest/sha1'

module Yapc
  class Message
    include Utility

    def show
      haml <<EOF
!!!
%html
  %head
    %script{:src => "http://js.pusherapp.com/1.7/pusher.min.js"}
    %script{:src => "https://ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js"}
  %body
    %input{:type => 'text', :name => 'text', :id => 'text-field'}
    .messages
      #messages-start
    %script{:src => "/pusher.js"}
EOF
    end

    def create
      addr = env['HTTP_X_REAL_IP'] || env['REMOTE_ADDR']
      Pusher['messages'].trigger 'message-create', :text => params[:text], :ip_digest => Digest::SHA1.hexdigest(addr+'llerkt3040f0dago-0o')[0..10]
      render params.inspect
    end
  end
end
