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
    %script{:type => "text/javascript"} initializeChat('text-field','messages-start','#{Yapc::KEY}');
EOF
    end

    def create
      Pusher['messages'].trigger 'message-create', :text => escape_with_links(params[:text]), :id_hash => id_hash
      render params.inspect
    end

    def update
      Pusher['messages'].trigger 'message-update', :text => escape_with_links(params[:text]), :id_hash => id_hash, :sequence => params[:sequence]
      render params.inspect
    end

    protected

    def escape_with_links(string)
      clean = CGI.escapeHTML(params[:text])
      clean.gsub(/(http[^ ]+)/,'<a href="\1" target="_blank">\1</a>')
    end

    def id_hash
      Digest::SHA1.hexdigest((env['rack.session'][:id] || env['HTTP_X_REAL_IP'] || env['REMOTE_ADDR']).to_s+'llerkt3040f0dago-0o')[0...6]
    end
  end
end
