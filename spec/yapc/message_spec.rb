require File.join(File.dirname(__FILE__),'../spec_helper.rb')

describe Yapc::Message do
  before(:each) do
    @env = {}
    @controller = Yapc::Message.new(@env)
    @controller.stub!(:params).and_return({"data"=>{"0"=>{"text"=>"t", "sequence"=>"0"}, "1"=>{"text"=>"te", "sequence"=>"1"}}}.with_indifferent_access)
    @controller.stub!(:id_hash).and_return('id_hash')
    @controller.stub!(:wikified_name).and_return('wikified_name')
  end

  describe "message_data" do
    it "pulls the data out of the params" do
      @controller.send(:message_data).size.should == 2
    end
  end
end