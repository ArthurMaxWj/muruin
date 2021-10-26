// current and save actions:

// saves state to page under 'current'
function save() {
  var name = View.state.current();

  if (name == '#non-erasable') return; // skip if it's a wildcart

  var code = $('#inputarea #code-area').val();
  var out = $('#inputarea #output-area').val();
  var err = $('#inputarea #error-area').val();
  var status = $('#inputarea #error-code').val();

  Page.byName(name).setAll(Page.hash_from(code, out, err, status));
}

function quickSave(code) {
  var name = View.state.current();
  Page.byName(name).code = code;
}

function current() {
  return sessionStorage.getItem('currentPage');
}

function currentSet(name) {
  sessionStorage.setItem('currentPage', name);
}

// menu actions:

var menuId = '#pages';

function renderItem(name) {
  var del = '<i class="fas fa-times-circle" data-action="rem-item"></i>';
  var loc = '<i class="fas fa-lock"></i>';
  var elem = '<li data-pname="' + name + '"><span>' + name + '</span>' + (View.state.isLocked(name) ? loc : del) + '</li>';
  $(menuId).append(elem);
}

function renderAll(all) {
  for (var i = 0; i < all.length; i++) {
    View.display.menu.renderItem(all[i]);
  }
}

function clear() {
  $(menuId).html('');
}

function renderSelection() {
  var name = current();

  $(menuId + ' li').removeClass('page-selected');
  $(menuId + ' li[data-pname=' + name + ']').addClass('page-selected');
}

function renderBody() {
  var page = Page.byName(current());

  $('#inputarea #code-area').val(page.code);
  $('#inputarea #output-area').val(page.out);
  $('#inputarea #error-area').val(page.err);
  $('#inputarea #error-code').val(page.status);

  $('#inputarea #resultarea').show();
}

// switches to page, renders body and menu
// Saves contents of body to 'current', to prevent that set current to '#non-erasable' like so:
//    currentSet('#non-erasable');
function switchTo(name) {
  View.state.save();
  View.state.currentSet(name);
  View.display.renderBody();
  View.display.menu.renderSelection();

  refreshNamediv();
  refreshReadonly();
}

// basic initalization:

function generateDeafults() {
  Page.byName('test-add').setAll({ code: 'puts "2 + 2 = #{2+2}"', out: '4', err: '', status: '0' });
  Page.byName('test-hello').setAll({ code: 'puts "Hello world!"', out: 'Hello world!', err: '', status: '0' });
}

function init() {
  var all = Page.allNames();
  if (all.length == 0) {
    View.actions.generateDeafults();
    all = Page.allNames();
  }

  View.display.menu.renderAll(all);
  currentSet('#non-erasable'); // to prevent 'switchTo' from accidentally saving empty values to one of pages
  View.actions.switchTo(all[0]);
}

// locking mechnism:

function isLocked(name) {
  var i = localStorage.getItem('@page.lock:' + name);
  if (i === null) return false;else return i == 'yes';
}

function setLock(name, should_lock) {
  if (should_lock) View.state.lock(name);else View.state.unlock(name);
}

function lock(name) {
  localStorage.setItem('@page.lock:' + name, 'yes');
}

function unlock(name) {
  localStorage.setItem('@page.lock:' + name, 'no');
}

// removing, adding and renaming Pages:

function removePage(name) {
  Page.byName(name).remove();
  $(menuId).html(''); // clearing menu

  var all = Page.allNames();
  if (all.length == 0) {
    View.actions.generateDeafults();
    all = Page.allNames();
  }

  View.display.menu.renderAll(all);
  currentSet('#non-erasable'); // to prevent 'switchTo' from accidentally saving empty values to one of pages
  switchTo(all[0]);
  setPagesActions();
}

function addPage(name) {
  name = name.replace('#', '');
  if (name == '') name = 'unnamed';

  if (Page.doesExist(name)) {
    switchTo(name);
    return false;
  }

  Page.byName(name).setSome({
    code: "'empty'",
    out: "'empty'",
    err: '<empty>',
    status: '<empty>'
  });
  View.display.menu.clear();
  View.display.menu.renderAll(Page.allNames());
  setPagesActions();
  switchTo(name);
  return true;
}

function renamePage(name) {
  name = name.replace('#', '');
  if (name == '') name = 'unnamed';

  if (Page.doesExist(name)) {
    switchTo(name);
    return false;
  }

  View.state.save();
  var oldName = View.state.current();
  Page.setSome(name, Page.byName(oldName));
  Page.byName(name).remove();
  currentSet('#non-erasable'); // to prevent 'switchTo' from accidentally saving empty values to one of pages
  View.display.menu.clear();
  View.display.menu.renderAll(Page.allNames());
  switchTo(name);
  setPagesActions();
  return true;
}

var View = {
  state: {
    current: current,
    currentSet: currentSet,
    save: save,
    quickSave: quickSave,
    isLocked: isLocked,
    lock: lock,
    unlock: unlock,
    setLock: setLock
  },
  actions: {
    init: init,
    generateDeafults: generateDeafults,
    switchTo: switchTo,
    removePage: removePage,
    addPage: addPage,
    renamePage: renamePage
  },
  display: {
    renderBody: renderBody,
    menu: {
      renderItem: renderItem,
      renderAll: renderAll,
      renderSelection: renderSelection,
      clear: clear
    }
  }
};