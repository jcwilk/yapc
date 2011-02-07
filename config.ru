run Proc.new{|env|
  status, headers, body = 200, {'Content-Type' => 'text/html'}, ''
  case env['PATH_INFO']
  when /^\/?$/
    body = "index"
  else
    body = env['PATH_INFO']
  end
  [status,headers,body]
}