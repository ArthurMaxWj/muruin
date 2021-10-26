require 'docker'

module Muruin
module RunMethods
class RunMethod
  attr_reader :out, :err, :status

  def initialize(code)
    @code = code
  end

  def result
    {
      out: @out, 
      err: @err, 
      status: @status
    }
  end

  def res
    [ @out, @err, @status ]
  end
  
  def whole_result # TODO delete + refactor
    {
      out: @out, 
      err: @err, 
      status: @status
    }
  end

  def exec!(code = nil)
    raise 'this method should be overridden'
  end

  def perform_exec!(code = @code)
    r = exec!(code)

    raise ArgumentError.new(
        'Hash returned from "exec" needs to contain :out, :err and :status keys'
    ) unless %i[out err status].all? {|s| r.key? s}

    @out = r[:out]
    @err = r[:err]
    @status = r[:status]
    
    self.res
  end
end


# immplementation of drivers ------------------------

class DockerRuby < RunMethod
  def exec!(code)
    # basic ruby container with command, starting our sandboxed code (stored in file)
    container = Docker::Container.create('Image' => 'ruby:latest', 'Tty' => true)
    container.store_file('/code.rb', @code) # supplying code to be run

    out = ''
    container.start
    out, err, exit_code = container.exec(['ruby', '/code.rb'])
    container.stop
    out[0] ||= '' # in case of it being nil
    err[0] ||= '' # in case of it being nil

    {
      out: out[0][...-1], 
      err: err[0][...-1], 
      status: exit_code
    }
  end
end

end # end of Muruin::RunMethods
end # end of Muruin
