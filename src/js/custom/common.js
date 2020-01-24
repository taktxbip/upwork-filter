function lockScroll() {
  if ($("html").hasClass("lock")) $("html").removeClass("lock");
  else $("html").addClass("lock");
}

function scrollToAnchor(aid) {
  event.preventDefault();
  var tmp = $(aid).position();
  $("html,body").animate({ scrollTop: tmp.top - 100 }, 500);
}

//-------------------------
//-- jQuery Ready Start -->
//-------------------------
$(document).ready(function() {
  //-------------------------
  //-- Readmore Start -->
  //-------------------------
  $(".readmore").readmore({
    moreLink: '<a href=#" class="btn btn-link">Read More<span></span></a>',
    lessLink: '<a href=#" class="btn btn-link">Close<span></span></a>',
    heightMargin: 30
  });

  //-------------------------
  //-- Match Height Start -->
  //-------------------------
  $(".featured ul li > div").matchHeight({
    byRow: true,
    property: "height",
    target: null,
    remove: false
  });

  //-------------------------
  //-- Zoom For Images Start -->
  //-------------------------
  $(".zoom").each(function() {
    var img = $(this).find("img");
    $(this).attr("href", img.attr("src"));
  });

  //-------------------------
  //-- On Escape Start -->
  //-------------------------
  document.onkeydown = function(evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
      isEscape = evt.key === "Escape" || evt.key === "Esc";
    } else {
      isEscape = evt.keyCode === 27;
    }
    if (isEscape) {
      // Do something
    }
  };

  //-------------------------
  //-- Open Any Popup Start -->
  //-------------------------
  $(".open_popup").click(function() {
    var target = "#" + $(this).attr("data-src");
    $.fancybox.open([
      {
        src: target,
        type: "inline",
        afterClose: function() {
          lockScroll();
        }
      }
    ]);
    lockScroll();
  });

  //-------------------------
  //-- Turn Off img Drag Start -->
  //-------------------------
  $("img, a").on("dragstart", function(event) {
    event.preventDefault();
  });
});
//-------------------------
//-- jQuery Ready End -->
//------ ¯\_(ツ)_/¯ ------
