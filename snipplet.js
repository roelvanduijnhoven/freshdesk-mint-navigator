var currentHighlighted = null;

window.onkeyup = function (e) {
  var key = e.key;

  if (key != '-' && key != '=') {
    return;
  }

  if ($(':focus').prop('contentEditable')) {
    return;
  }

  var responses = $('[data-album]').toArray();

  var firstTime = false;

  // Start with last item by default
  // TODO better would be to pick one you are viewing at right now.
  if (currentHighlighted === null || $('[data-album=' + currentHighlighted + ']').length === 0) {
    firstTime = true;
    var highlightResponse = responses[responses.length - 1];

    // Find last response of which top part is visible
    for (var k in responses) {
      if (responses[k].dataset && $(responses[k]).offset().top > $(window).scrollTop() + 30) {
        firstTime = false;
        highlightResponse = responses[k];
        break;
      }
    }

    currentHighlighted = highlightResponse.dataset.album;
  }

  var currentIndex = 0;
  for (var i in responses) {
    if (responses[i].dataset && responses[i].dataset.album == currentHighlighted) {
      currentIndex = parseInt(i);
      break;
    }
  }

  var newIndex = currentIndex;
  if (!firstTime) {
    if (key == '-') {
      newIndex = Math.max(0, currentIndex - 1);
    } else if (key == '=') {
      newIndex = Math.min(responses.length - 1, currentIndex + 1);
    }
  }

  currentHighlighted = responses[newIndex].dataset.album;

  // The default scrollIntoView will not be accurate for some reason; that's why we introduce this element.
  var $anchor = $('<div style="position: absolute; top: -150px; left: 0;" />');
  $(responses[newIndex]).prepend($anchor);

  $anchor[0].scrollIntoView({
    block: 'start',
    behavior: "smooth",
    inline: "start"
  });

  // Highlight active item
  for (var j in responses) {
    if (responses[j].style) {
      $(responses[j]).css('borderColor', j == newIndex ? 'red' : '');
      $(responses[j]).find('.ticket-details__item').css('borderColor', j == newIndex ? 'red' : '');
    }
  }
}
