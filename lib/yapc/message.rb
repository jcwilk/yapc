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
      Pusher['messages'].trigger 'message-create', message_data
      render params.inspect
    end

    def update
      Pusher['messages'].trigger 'message-update', message_data(:sequence => params[:sequence])
      render params.inspect
    end

    protected

    def message_data(extra = {})
      {
        :text => escape_with_links(params[:text]),
        :id_hash => id_hash,
        :name => wikified_name
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
