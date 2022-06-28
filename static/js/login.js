// This seems useful https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions
// Need to decode the JWT token from google to access all the properties
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
		},
		error: function (error) {
			//Oh no! There was an error, print it.
			console.log(error);
		},
	});
}
