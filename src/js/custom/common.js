
class upworkFilter {

	constructor() {
		this.countryRestrict = [
			"India",
			"Cambodia",
			"Israel",
			"Slovenia",
			"Ukraine",
			"Pakistan",
			"Bulgaria",
			"Kenya",
			"Turkey",
			"Russia"
		];
		this.textRestrict = [];
	// Don't show if rating lower
		this.ratingRestrict = 4.49;

		this.launched = false;

	}

	addCountries(array) {
		array.forEach(element => {
			this.countryRestrict.push(element);
		});
	}

	addText(array) {
		array.forEach(element => {
			this.textRestrict.push(element);
		});
	}

	action() {
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

}


var upwork = new upworkFilter();

upwork.addText(['Brazil', 'Nigeria']);

console.log(upwork.textRestrict);



$(document).ready(function() {

	$('.filters_wraper').click( function() {
		if ( $(this).hasClass('active') ) {
			$(this).removeClass('active');
			$(this).closest('.ext__body').find('.main_filters').removeClass('active');
			$('.ext__footer .disabled').removeClass('disabled');
		}
		else {
			$(this).addClass('active');
			$(this).closest('.ext__body').find('.main_filters').addClass('active');
			$('.ext__footer .btn-action').addClass('disabled');
		}
	});

	$('.btn-save').click( function() { 
		$('.active').removeClass('active');
		$('.ext__footer .disabled').removeClass('disabled');
	});

	$('.btn-action').click( function() { 
		if ( $(this).hasClass('do-action') ) {
			$(this).removeClass('do-action');
			$(this).text('Hide Contracts');
		}
		else {
			$(this).addClass('do-action');
			$(this).text('Extended Filters Enabled');
		}
	});


	new SlimSelect({
				select: '#countries',
				placeholder: 'Placeholder Text Here',
				showSearch: true,
				searchText: 'Sorry couldnt find anything',
				onChange: (info) => {
					console.log(info);
				}
		})
	

});
