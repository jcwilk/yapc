require ::File.join(::File.expand_path(::File.dirname(__FILE__)),'..','..','environment')

describe CacheManager::Middleware do
  describe CacheManager::Middleware::Faker do
    before(:each) do
      @client = CacheManager::Middleware::Faker.new
      @client.flush
      @client.class.cache['existing_key'] = 'value'
    end

    describe "flush" do
      it "clears the cache" do
        @client.flush
        @client.fetch('existing_key').should be_nil
      end
    end

    describe "fetch" do
      it "returns nil if the key doesn't exist (or maps to nil) and they didn't pass a block" do
        @client.fetch('bogus_key').should be_nil
      end

      it "retrieves a value if it exists" do
        @client.fetch('existing_key').should == 'value'
        (@client.fetch('existing_key'){'blah'}).should == 'value'
      end

      it "sets the value to the return of the passed block if the retrieved value is nil" do
        (@client.fetch('missing_key'){'new_value'}).should == 'new_value'
        @client.fetch('missing_key').should == 'new_value'
      end

      it "does not execute the passed block if the value is not nil" do
        lambda{@client.fetch('existing_key'){raise "ran the block!"}}.should_not raise_error
      end
    end
  end
end