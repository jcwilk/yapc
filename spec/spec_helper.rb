$HELPER_LOADED ||= begin #ensure it gets run once
  require File.join(File.dirname(__FILE__),'../environment.rb')
  
  RSpec.configure do |c|

  end
  true
end