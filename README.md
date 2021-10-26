# Muruin
##### Multiple Runner Interface
#
### Overview

A GUI for running Ruby scripts in safe Docker container instead of Sandbox (like RubyNote repository does). Written in pure JS+jQuery with some support from ES6/Babbel. Ruby and 'docker-api' gem handle safe execution.

### Compiling ES6
Compile 'gui/public/src/js' to 'gui/public/compiled/js' with Babbel.

### Running GUI
There's GUI included under 'gui/sinatra_frontend.rb'. It's a minimalistic GUI running on Sinatra in backend, can be started with `ruby gui/sinatra_frontend.rb` on default port 4567 or with option `-p <port>` under a custom one. No Docker configuration needed if running on defaults (these are handled by 'docker-api' gem).
