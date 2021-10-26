require './running/run_methods.rb'

module Muruin
module RunLanguage
  class LanguageRunner
    attr_reader :out, :err, :status

    def initialize(code)
      @code = code
    end

    def run!(code = nil)
      raise 'method "LanguageRunner#run!" should be overridden'
    end

    def results
      {
        out: @out,
        err: @err,
        ststus: @status
      }
    end

    def res
      [ @out, @err, @status ]
    end
  end

  class Ruby < LanguageRunner
    def run!(code = @code)
      @out, @err, @status = Muruin::RunMethods::DockerRuby.new(code).perform_exec!
    end
  end
end
end
