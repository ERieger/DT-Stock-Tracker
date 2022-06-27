// This seems useful https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions
// Need to decode the JWT token from google to access all the properties
function loginCallback(response) {
    const responsePayload = decodeJwtResponse(response.credential);

    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);

}
