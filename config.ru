require 'rubygems'
require 'bundler/setup'
Bundler.require(:default)
require 'active_support/core_ext'

$:.unshift ::File.join(::File.expand_path(::File.dirname(__FILE__)),'lib')
require 'yapc'

#use Rack::Static, :urls => %w(/pusher.js), :root => "public"
#run Rack::Builder.new{
#  map '/c' do
#    run Yapc::Convo
#  end
#  map '/m' do
#    run Yapc::Message
#  end
#  map '/d' do
#    run Proc.new{|e|[200,{'Content-Type' => 'text/plain'},[e.keys.sort.map{|k|k+": "+e[k].inspect}.join("\n")]]}
#  end
#  map '/' do
#    run Proc.new{}
#  end
#}

run Proc.new{|e|[301,{'Content-Type' => 'text/html','Location' => "http://yapc.heroku.com#{e['PATH_INFO']}"},["Permanently moved to <a href='http://yapc.heroku.com#{e['PATH_INFO']}'>yapc.heroku.com</a>."]]}