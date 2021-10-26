// for copy button
function copyToClipboard(element) { // OPTIMIZE use more modern methods
  var $temp = $('<input>'); $temp.css('opacity', '0'); // invisible element neede for copying
  $("body").append($temp);
  $temp.val(element.val());
  $temp.select();
  document.execCommand("copy");
  $temp.remove();
}

// resetting view:

function setPagesActions() {
  $('#pages li').click(function() {
    View.actions.switchTo($(this).attr('data-pname'));
  });
  
  $('#pages li i[data-action=rem-item').click(function() {
    View.actions.removePage($(this).parent().attr('data-pname'));
    return false;
  });
}

function refreshNamediv() {
  $('#namediv span').text(View.state.current());
}

function refreshReadonly() {
  var area = $('#code-area');
  var cur = View.state.current();
  var is_ro = View.state.isLocked(cur);

  if (is_ro)
    $('header #lock-btn').html('<i class="fas fa-lock-open"></i>');
  else
    $('header #lock-btn').html('<i class="fas fa-lock"></i>');

  area.prop('readonly', is_ro);

  if (is_ro) $('#readonly-info').show();
  else $('#readonly-info').hide();
}

// document-ready: ------------------------------------------------------

$(document).ready(function() {
  // basic init:
  $('#resultarea').hide(); // shows after first click on 'Run' tehen visible whole time
  View.actions.init(); // inits View and Pages
  $('aside').hide();
  setPagesActions(); // restarting menu items actions

  // Setting Evet Listeners:

  // automatic saving 
  $('#code-area').on('input', function() {
    View.state.quickSave($(this).val());
  });
  
  $(window).on("beforeunload", function() { 
    View.state.quickSave($(this).val()); 
  })

  // run anc copy circular buttons:

  $('#inputarea #run-btn').click(function() {
    $('#resultarea').show();
    doAjaxThing($('#code-area').val()); // and it calls 'loadResults' which updates state and display
  });

  $('#inputarea .copy-btn').click(function() {
    var elemToCopy = $(this).parent().find('textarea, input');
    copyToClipboard(elemToCopy);


    var animated = $(this);
    animated.addClass('animation-running');
    setTimeout(function() { // REFACTOR make timeout value dynamic (dependant css or some shared value)
      animated.removeClass('animation-running');
    }, 1000); // there's 1000 becouse that's the value from CSS 
  });

  // readonly:

  $('header #lock-btn').click(function() {
    var area = $('#code-area');
    var cur = View.state.current();
    var is_ro = View.state.isLocked(cur);

    View.state.setLock(cur, !is_ro);

    View.display.menu.clear();
    View.display.menu.renderAll(Pages.allNames());
    View.display.menu.renderSelection();
    setPagesActions();

    refreshReadonly();
  });

  // showing/hiding menu:
  
  $('#menu-btn').click(function() {
    $('aside').fadeToggle(200);
  });

  $('#menu-hide-btn').click(function() {
    $('aside').fadeOut(200);
  });

  // adding/switching pages:

  $('aside #control i').click(function() {
    var name = $('aside #control input').val(); 
    View.actions.addPage(name);
  });

  $('aside #control input').keypress(function(e) {
    if (e.which == 13) $('aside #control i').click();
  });

  // renaming:

  $('#namediv').click(function() {
    $('#namediv input').val($('#namediv span').text());
    $(this).addClass('editing');
    $('#namediv input').focus();
  });

  $('#namediv input').keypress(function(e) {
    if (e.which == 13) $('#namediv i').click();
  });

  
  $('#namediv i').click(function() {
    if (!$('#namediv').hasClass('editing')) {
      $('#namediv').click();
      return false;
    }
    $('#namediv').removeClass('editing');
    $('#namediv span').text($('#namediv input').val());
    $('#namediv').removeClass('editing');

    var name = $('#namediv input').val(); 
    View.actions.renamePage(name);
    return false; // prevents adding class again by '#namediv' evenrts
  });

  $('#namediv input').focusout(function() {
    $('#namediv').removeClass('editing');
  });

  $('#namediv input').focusout(function() {
    $('#namediv').removeClass('editing');
  });
});
