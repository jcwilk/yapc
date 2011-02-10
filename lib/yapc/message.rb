require 'yapc/utility'

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
      .message-start
    %script{:src => "/pusher.js"}
EOF
    end

    def create
      Pusher['messages'].trigger 'message-create', :text => params[:text]
      render params.inspect
    end
  end
end
