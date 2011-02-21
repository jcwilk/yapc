require 'yapc/utility'
require 'digest/sha1'
require 'cgi'

module Yapc
  class Message
    include Utility

    def show
      haml :show
    end

    def create
      send_data 'message-create', message_data
      render params.inspect
    end

    def update
      send_data 'message-update', message_data
      render params.inspect
    end

    protected

    def send_data(channel, data)
      #Pusher['messages'].trigger channel, data
      RestClient.post "http://localhost:3000/m/#{channel}.json", data.to_json, :content_type => :json, :accept => :json
    end

    def message_data(extra = {})
      {
        :text => escape_with_links(params[:text]),
        :id_hash => id_hash,
        :name => wikified_name,
        :sequence => params[:sequence]
      }.merge(extra)
    end

    def wikified_name
      "<a href='http://en.wikipedia.org/wiki/Special:Search/#{session[:name].underscore}' target='_blank'>#{session[:name]}</a>"
    end

    def escape_with_links(string)
      clean = CGI.escapeHTML(params[:text])
      clean.gsub(/(http[^ ]+)/,'<a href="\1" target="_blank">\1</a>')
    end

    def id_hash
      Digest::SHA1.hexdigest((session[:id] || env['HTTP_X_REAL_IP'] || env['REMOTE_ADDR']).to_s+'llerkt3040f0dago-0o')[0...6]
    end
  end
end
