require 'rubygems'
require 'bundler/setup'
Bundler.require(:default)
require 'active_support/core_ext'

$:.unshift ::File.join(::File.expand_path(::File.dirname(__FILE__)),'lib')
require 'yapc'

use Rack::Static, :urls => %w(/pusher.js), :root => "public"
run Rack::Builder.new{
  map '/c' do
    run Yapc::Convo.new
  end
  map '/m' do
    run Yapc::Message.new
  end
  map '/d' do
    run Proc.new{|e|[200,{'Content-Type' => 'text/plain'},[e.keys.sort.map{|k|k+": "+e[k].inspect}.join("\n")]]}
  end
}