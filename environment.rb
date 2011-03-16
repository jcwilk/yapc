require 'rubygems'
require 'bundler/setup'
Bundler.require(:default)
Bundler.require(:development) if ENV['RACK_ENV'] == 'development'
require 'active_support/core_ext'

$:.unshift ::File.join(::File.expand_path(::File.dirname(__FILE__)),'lib')
require 'yapc'
require 'cache_manager'