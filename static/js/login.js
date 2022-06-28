function loginCallback(response) {   
    console.log(JSON.stringify(response.credential))
    $.ajax({
		async: false, //We do not want this to be asynchonous, otherwise data will not be returned
		method: "POST",
		url: "/auth/exists",
		data: {
			credential: String(response.credential) //ensure sql is a string
		},
		success: function (data) {
			console.log(data);
			if (data == 'user exists' || data == 'Successfully added user') {
				localStorage.setItem('IDToken', response.credential);
				window.location.replace("http://localhost:5500/");
			}
		},
		error: function (error) {
			//Oh no! There was an error, print it.
			console.log(error);
		},
	});
}
