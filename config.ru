puts 'Annnnd...' if ENV['RACK_ENV'] == 'development'

require ::File.join(::File.expand_path(::File.dirname(__FILE__)),'environment')

use Rack::SslEnforcer unless ENV['RACK_ENV'] == 'development'
use Rack::Static, :urls => ['/javascripts','/stylesheets'], :root => "public"
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