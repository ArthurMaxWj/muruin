class Page {
  constructor(name) {
    this.name = name;
  }

  get code() { return localStorage.getItem('@page.code:' + this.name); }
  set code(val) { localStorage.setItem('@page.code:' + this.name, val); }

  get out() { return localStorage.getItem('@page.out:' + this.name); }
  set out(val) { localStorage.setItem('@page.out:' + this.name, val); }

  get err() { return localStorage.getItem('@page.err:' + this.name); }
  set err(val) { localStorage.setItem('@page.err:' + this.name, val); }

  get status() { return localStorage.getItem('@page.status:' + this.name); }
  set status(val) { localStorage.setItem('@page.status:' + this.name, val); ;}

 setAll(hash) {
    this.code = hash.code;
    this.out = hash.out;
    this.err = hash.err;
    this.status = hash.status;
  }

  setSome(hash) {
    this.code = hash.code || this.code;
    this.out = hash.out || this.out;
    this.err = hash.err || this.err;
    this.status = hash.status || this.status;
  }

  remove() {
    localStorage.removeItem('@page.code:' + this.name);
    localStorage.removeItem('@page.out:' + this.name);
    localStorage.removeItem('@page.err:' + this.name);
    localStorage.removeItem('@page.status:' + this.name);
  }

  // static:

  static byName(name) {
    /*var code = localStorage.getItem('@page.code:' + name);
    var out = localStorage.getItem('@page.out:' + name);
    var err = localStorage.getItem('@page.err:' + name);
    var status = localStorage.getItem('@page.status:' + name);*/
    return new Page(name);
  }

  static doesExist(name) {
    return !(localStorage.getItem('@page.code:' + name) === null);
  }

  static allNames() { // TODO add test for empty name
    var all = [];
    for (var i = 0; i < localStorage.length; i++) {
      var keyParts = localStorage.key(i).split(':');
      var prop = keyParts[0];
      var name = keyParts[1];
      if (prop == '@page.code') // 'code' determines existence
        all.push(name);
    }
    return all;
  }

  static hash_from(code, out, err, status) {
    return { code: code, out: out, err: err, status: status };
  }
}
