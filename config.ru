run Proc.new do |env|
  status, headers, body = 200, {'Content-Type' => 'text/html'}, ''
  case env['PATH_INFO']
  when /^\/?$/
    body = "index"
  else
    body = $~
  end
  [status,headers,body]
end