
$(document).ready(function() {

	$('.filters_wraper').click( function(){
			$(this).toggleClass('active');
			$(this).closest('.ext__body').find('.main_filters').toggleClass('active');
	});

	

});
