require 'rubygems'
require 'bundler/setup'
Bundler.require(:default)
require 'active_support/core_ext'

$:.unshift ::File.join(::File.expand_path(::File.dirname(__FILE__)),'lib')
require 'yapc'

use Rack::Static, :urls => %w(/pusher.js), :root => "public"
use Rack::Session::Cookie, :key => 'rack.session',
                               :domain => '.yapc.heroku.com',
                               :path => '/',
                               :expire_after => 2592000,
                               :secret => 'sdf8gud89fgudfbxfgd'

use Yapc::CookieRandomizer
map '/c' do
  run Yapc::Convo
end
map '/m' do
  run Yapc::Message
end
map '/d' do
  run Proc.new{|e|[200,{'Content-Type'=>'text/plain'},[e.keys.sort.map{|k|k+": "+e[k].inspect}.join("\n")]]}
end
map '/' do
  run Proc.new{|e|[303,{'Content-Type'=>'text/plain','Location'=>'/m'},['Redirecting to messages app at /m...']]}
end