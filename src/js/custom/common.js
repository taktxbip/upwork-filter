class upworkFilter {

	constructor() {
		this.data = {
			countryRestrict: [
				"India",
				"Cambodia"
			],
			ratingRestrict: 4.49,
			spentRestrict: 500
		}
		this.launched = false;
	}


	// getDataFromStorage() {

	// chrome.storage.sync.get(/* String or Array */["phasersTo"], function(items){
	// 		//  items = [ { "phasersTo": "awesome" } ]
	// 	});
	// }

	// saveDataToStorage(data) {
	// 	chrome.storage.sync.set(data, function(){
	// 		console.log('Upwork Extension: Settings saved');
	// 	});
	// }

	action() {

		console.log('Action is here');

		$('.job-tile').each(function() {

			var rating = $(this).find(".js-feedback > span").attr("data-eo-popover-html-unsafe");
			rating = rating.split(" Stars, based on")[0];
			var location = $(this).find("strong.client-location").text();

			if ( rating < this.data.ratingRestrict || rating === "No feedback yet" || this.data.countryRestrict.indexOf( location ) != -1)
				$(this).css("display", "none");
			
	
			// var description = $(this).find(".description .ng-binding").text();
			// textRestrict.forEach( el => {
			// 	if ( description.indexOf(el) != -1 )
			// 		$(this).css("display", "none");
			// });
				
			// console.log('Description: ', description);
			console.log('Location: ', location, ' Rating:', rating);
		});

		
	}

}

function loadDataToForm(data, multiselect) {
	$('#spent').val(data.spentRestrict);
	$('#rating').val(data.ratingRestrict);
	multiselect.set(data.countryRestrict);
}
function saveDataFromForm(multiselect) {
	upwork.data.spentRestrict = $('#spent').val();
	upwork.data.ratingRestrict = $('#rating').val();
	upwork.data.countryRestrict = multiselect.selected();
}

function showNotification(message) {
	if (message == '')
		$('#error_message.show').removeClass('show');
	else {
		$('#error_message').html(message);
		$('#error_message').hasClass('show') ? '' : $('#error_message').addClass('show');
	}
}

var upwork = new upworkFilter();

$(document).ready(function() {

	var currentURL = 'https://www.upwork.com/ab/jobs/search';
	// chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, 
	// function(tabs){
	// 	getCurrentURL(tabs[0].url);
	// });
	// function getCurrentURL(tab){
	// 	currentURL = tab;
	// }


	var slim = new SlimSelect({
		select: '.ext #countries',
		placeholder: 'Placeholder Text Here',
		showSearch: true,
		searchText: 'Sorry couldnt find anything'
	})

	// Load Data To Form
	loadDataToForm(upwork.data, slim);


	$('.filters_wraper').click( function() {

		if ( $('.btn-action').hasClass('do-action') ) {
			showNotification("Disable extended filters first");
			return;
		}
		if ( $(this).hasClass('active') ) {
			$(this).removeClass('active');
			$(this).closest('.ext__body').find('.main_filters').removeClass('active');
			$('.ext__footer .disabled').removeClass('disabled');
			$(this).text('Show Filters');
			showNotification('');
			saveDataFromForm(slim);
		}
		else {
			$(this).addClass('active');
			$(this).closest('.ext__body').find('.main_filters').addClass('active');
			$('.ext__footer .btn-action').addClass('disabled');
			$(this).text('Hide Filters');
		}
	});




	$('.btn-save').click( function() { 

		// Validation
		// validate();

		// Save
		saveDataFromForm(slim);

		$('.active').removeClass('active');
		$('.ext__footer .disabled').removeClass('disabled');

		showNotification('');

	});

	$('.btn-action').click( function() { 
		if ( $(this).hasClass('disabled') ) {
			$('.filters_wraper').hasClass('active') ? showNotification('Save or hide settings first') : '';
			return;
		}
		if ( $(this).hasClass('do-action') ) {
			// Off
			$(this).removeClass('do-action');
			$(this).text('Hide Contracts');
			showNotification('');
		}
		else {
			// On
			// ---
			// Check if upwork
			var upworkLink = 'https://www.upwork.com/ab/jobs/search';

			if ( currentURL.indexOf(upworkLink) == -1 ) {
				showNotification('To start go to: https://www.upwork.com/ab/jobs/search');
				return;
			}

			$(this).addClass('do-action');
			$(this).text('Extended Filters Enabled');

			// setTimeout( () => upwork.action(), 10000 );
			upwork.action();

		}
	});



	

});
