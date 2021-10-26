require 'sinatra'
require "sinatra/json"

require 'json'

require './running/run_language.rb'
include Muruin

get '/' do
  redirect '/interface'
end

get '/interface' do
  erb :main
end

post '/run', :provides => :json do
  code = params['code']

  proc{code = params['code']
  runn = Runnable.new(params['code']); runn.run!
  outs = runn.whole_out}

  run_ruby = RunLanguage::Ruby.new(code)
  run_ruby.run!

  obj = { 'out' => run_ruby.out, 'err' => run_ruby.err, 'status' => run_ruby.status }

  json obj
end
