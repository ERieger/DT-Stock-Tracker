function loginCallback(response) {   
    // console.log(JSON.stringify(response.credential))
    $.ajax({
		async: false, //We do not want this to be asynchonous, otherwise data will not be returned
		method: "POST",
		url: "/auth/exists",
		data: {
			credential: String(response.credential) //ensure sql is a string
		},
		success: function (data) {
			login_redirect(data, response);
		},
		error: function (error) {
			//Oh no! There was an error, print it.
			console.log(error);
		},
	});
}

function login_redirect(data, response) {
	if (data == 'user exists' || data == 'Successfully added user') {
		localStorage.setItem('IDToken', response.credential);
		$.ajax({
			async: false, //We do not want this to be asynchonous, otherwise data will not be returned
			method: "POST",
			url: "/auth/role",
			data: {
				credential: String(response.credential) //ensure sql is a string
			},
			success: function (admin) {
				console.log(admin)
				if (admin == 'False') {
					localStorage.setItem('admin', false);
					window.location.replace("http://localhost:5500/");
				} else {
					localStorage.setItem('admin', true);
					window.location.replace("http://localhost:5500/summary");
				}
			},
			error: function (error) {
				//Oh no! There was an error, print it.
				console.log(error);
			},
		});
	}
}