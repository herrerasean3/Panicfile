console.log('Search.js loaded');

$('#submit').on('click', function(e){
	console.log($('#cat2').val())
	if ($('#cat2').val() === null) {
		$('#cat2').val("")
	}
	let target = `searchterm=${$('#searchterm').val()}&cat2=${$('#cat2').val()}`
	var newURL = window.location.protocol + "//" + window.location.host + "/search/?";
	e.preventDefault();
	window.location.replace(newURL + target);
})