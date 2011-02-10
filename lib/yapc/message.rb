require 'yapc/utility'

module Yapc
  class Message
    include Utility

    def show
      haml <<EOF
!!!
%html
  %head
    %script{:src => "/pusher.js"}
    %script{:src => "http://js.pusherapp.com/1.7/pusher.min.js"}
  %body
    %form{:action => '/m', :method => 'POST'}
      %input{:type => 'text', :name => 'text', :id => 'text'}
      %input{:type => 'submit', :value => 'This is a test.'}
EOF
    end

    def create
      Pusher['messages'].trigger 'message-create', :text => params[:text]
      render params[:text].inspect+" sent!"
    end
  end
end
