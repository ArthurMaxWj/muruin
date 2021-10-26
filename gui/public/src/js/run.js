function loadResults(json) {
  Page.byName(View.state.current()).setAll({
    out: json.out,
    err: json.err,
    status: json.status
  });

  $('#output-area').val(json.out);
  $('#error-area').val(json.err);
  $('#error-code').val(json.status);
  View.state.save();
}

function doAjaxThing(thing) {
  $.post('/run', { code: thing}, loadResults, 'json').fail(function (req, status, err) {
    console.log('There has been AJAX error: ', status, err);
  });
}
