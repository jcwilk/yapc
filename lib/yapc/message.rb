require 'yapc/utility'
require 'digest/sha1'
require 'cgi'

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
      Pusher['messages'].trigger 'message-create', :text => escape(params[:text]), :ip_digest => ip_hash
      render params.inspect
    end

    def update
      Pusher['messages'].trigger 'message-update', :text => escape(params[:text]), :ip_digest => ip_hash, :sequence => params[:sequence]
      render params.inspect
    end

    protected

    def escape(string)
      clean = CGI.escapeHTML(params[:text])
      clean.gsub(/http[^ ]+/,"<a href='#{$1}'>#{$1}</a>")
    end

    def ip_hash
      Digest::SHA1.hexdigest((env['HTTP_X_REAL_IP'] || env['REMOTE_ADDR'])+'llerkt3040f0dago-0o')[0...6]
    end
  end
end
