puts 'Annnnd...' if ENV['RACK_ENV'] == 'development'
require 'rubygems'
require 'bundler/setup'
Bundler.require(:default)
require 'active_support/core_ext'

$:.unshift ::File.join(::File.expand_path(::File.dirname(__FILE__)),'lib')
require 'yapc'
require 'cache_manager'

use Rack::Static, :urls => Dir.entries(::File.join(::File.dirname(__FILE__),'public')).select{|f| f =~ /[.]js$/}.map{|f|'/'+f}, :root => "public"
use Rack::Session::Cookie, :key => 'rack.session',
                               :domain => '.yapc.duostack.net',
                               :path => '/',
                               :expire_after => 2592000,
                               :secret => 'sdf8gud89fgudfbxfgd'

use Yapc::CookieRandomizer
use CacheManager::Middleware
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
map '/flush_cache' do
  run CacheManager::BlowUp
end
puts 'go!' if ENV['RACK_ENV'] == 'development'