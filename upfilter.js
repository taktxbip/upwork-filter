var countryRestrict = [
	"India",
	"Cambodia",
	"Israel",
	"Slovenia",
	"Ukraine",
	"Pakistan",
	"Russia"
];

var textRestrict = [

];

// Don't show if rating lower
var ratingRestrict = 4.49;

setTimeout(function(){ body(); }, 3000);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
			// console.log('Extension Clicked');
			body();
    }
  }
);


function body() {
	$('.job-tile').each(function() {

		var location = $(this).find("strong.client-location").text();

		// console.log('countryRestrict: ', countryRestrict);
		if (countryRestrict.indexOf( location ) != -1)
				$(this).css("display", "none");

		
		var rating = $(this).find(".js-feedback > span").attr("data-eo-popover-html-unsafe");
		rating = rating.split(" Stars, based on")[0];
		if ( rating < ratingRestrict || rating === "No feedback yet" )
			$(this).css("display", "none");
		

		var description = $(this).find(".description .ng-binding").text();

		textRestrict.forEach( el => {
			if ( description.indexOf(el) != -1 )
				$(this).css("display", "none");
		});
			
		// console.log('Description: ', description);
		console.log('Location: ', location, ' Rating:', rating);
	});
}