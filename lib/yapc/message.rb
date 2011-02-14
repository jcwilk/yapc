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
    %script{:src => "https://ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js"}
  %body
    %input{:type => 'text', :name => 'text', :id => 'text-field'}
    .messages
      #messages-start
        ='-----------------------------------'
    %script{:src => "http://js.pusherapp.com/1.7/pusher.min.js"}
    %script{:src => "/pusher.js"}
EOF
    end

    def create
      Pusher['messages'].trigger 'message-create', :text => params[:text], :ip_digest => ip_hash
      render params.inspect
    end

    def update
      Pusher['messages'].trigger 'message-update', :text => params[:text], :ip_digest => ip_hash
      render params.inspect
    end

    protected

    def ip_hash
      Digest::SHA1.hexdigest((env['HTTP_X_REAL_IP'] || env['REMOTE_ADDR'])+'llerkt3040f0dago-0o')[0..10]
    end
  end
end
