// Autosizes the body element to the window dimensions, for full-page apps.
//
// Usage:
//
// Autosize.enable();
// Autosize.disable();
//

(function() {
  var updateSize = () => {
    $("body").css({
      height: $(window).height(),
      width: $(window).width()
    });
  };

  var enable = () => {
    $(window).on('resize', updateSize);
    updateSize();
  };

  var disable = () => {
    $(window).off('resize', updateSize);
  };

  window.Autosize = {
    enable: enable,
    disable: disable
  };
})();
