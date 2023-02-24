// Define function to update the disabled fields
$.fn.update_disabled = function () {
    // Reference to parent card
    let parents = $(this).parentsUntil('div.card-body');
    // Define refrences to each field
    let inputs = {
        width: $(parents[2]).find('input#width'),
        height: $(parents[2]).find('input#height'),
        length: $(parents[2]).find('input#length'),
        selects: $(parents[2]).find('select#materialSelect')
    }

    // Loop throuhg all inputs in parent card
    $(parents).find('input').each(function () {
        $(this).prop('disabled', false); // Set disabled to false
    });

    // Loop through all materials
    for (let i = 0; i < materials.length; i++) {
        // Get currently selected material
        if (materials[i].id == $(inputs.selects).val()) {
            // Get type of selected material (1: Board, 2: Plank, 3: Dowel)
            switch (materials[i].type) {
                case 1: // Board
                    $(inputs.height).prop('disabled', true); // Disable input
                    $(inputs.height).val(undefined); // Rest value
                    console.log('disable t');
                    break;

                case 2: // Plank
                    $(inputs.width).prop('disabled', true); // Disable input
                    $(inputs.width).val(undefined); // Rest value
                    $(inputs.height).prop('disabled', true); // Disable input
                    $(inputs.height).val(undefined); // Rest Value
                    console.log('disable wt');
                    break;

                case 3: // Dowel
                    // As above...
                    $(inputs.width).prop('disabled', true);
                    $(inputs.width).val(undefined);
                    $(inputs.height).prop('disabled', true);
                    $(inputs.height).val(undefined);
                    console.log('disable wt');
                    break;
            }
        } else {
            continue; // Skip curret loop iteration if not the material
        }
    }
}
