let materials;
window.onload = () => { // On window load
    $.ajax({
        async: false, //We do not want this to be asynchonous, otherwise data will not be returned
        url: "/api/materials/list",
        success: function (response) {
            console.log(response);
            materials = response; // Set global materials variable (because I couldn't be bothered parseing it aroud)
        },
        error: function (error) {
            //Oh no! There was an error, print it.
            console.log(error);
        }
    })

    $('.material-container').newMaterial() // Add first material box
    $('#save-btn').click(() => { add_project() }); // Add an action to the save button
    $('#delete-btn').click(() => { delete_project() });
};

function delete_material(elem) { $(elem).parents('div.material-container').find('div#material-card').length > 1 ? $(elem).parents('div#material-card').remove() : console.log('How about no...') };