let materials; // Global materials variable

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

// Define function to add a new material to the project
$.fn.newMaterial = function (piece) { // Accepts object piece as argument
    if (piece != undefined || piece != null) { // Piece defined - Rendering a piece
        // Append the new material row to the parent
        // Subsitutes the correct piece values in
        $(this).append(`
        <div class="row py-3" id="material-card">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-floating">
                                <select
                                    class="form-select"
                                    id="materialSelect"
                                    aria-label="Floating label select example"
                                >
                                </select>
                                <label for="materialSelect"
                                    >Material
                                </label>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="form-floating mb-3">
                                <input
                                    type="number"
                                    class="form-control"
                                    id="width"
                                    placeholder="width"
                                    value="${piece.w}"
                                />
                                <label for="width"
                                    >Width</label
                                >
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="form-floating mb-3">
                                <input
                                    type="number"
                                    class="form-control"
                                    id="height"
                                    placeholder="height"
                                    value="${piece.h}"
                                />
                                <label for="height"
                                    >Height</label
                                >
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="form-floating mb-3">
                                <input
                                    type="number"
                                    class="form-control"
                                    id="length"
                                    placeholder="length"
                                    value="${piece.l}"
                                />
                                <label for="length"
                                    >Length</label
                                >
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="form-floating mb-3">
                                <input
                                    type="number"
                                    class="form-control"
                                    id="qty"
                                    placeholder="quantity"
                                    value="${piece.qty}"
                                />
                                <label for="qty"
                                    >Quantity</label
                                >
                            </div>
                        </div>
                        <div class="col-md-1 mx-auto">
                            <div
                                class="btn btn-danger btn-block"
                                onclick="delete_material(this)"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    class="bi bi-trash-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);

        // Populate the dropdown
        // (includes the piece object and reference to the row as 'this')
        populate_materials(piece, this);
    } else { // Rendering a blank piece
        // Render a blank row
        // populate_materials() populate dropdown
        // Blank this time as it isn't already defined
        $(this).append(`
        <div class="row py-3" id="material-card">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-floating">
                                <select
                                    class="form-select"
                                    id="materialSelect"
                                    aria-label="Floating label select example"
                                >
                                    <option
                                        disabled
                                        selected
                                        hidden
                                    >
                                        Please select a
                                        material
                                    </option>
                                    ${populate_materials()}
                                </select>
                                <label for="materialSelect"
                                    >Material
                                </label>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="form-floating mb-3">
                                <input
                                    type="number"
                                    class="form-control"
                                    id="width"
                                    placeholder="width"
                                />
                                <label for="width"
                                    >Width</label
                                >
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="form-floating mb-3">
                                <input
                                    type="number"
                                    class="form-control"
                                    id="height"
                                    placeholder="height"
                                />
                                <label for="height"
                                    >Height</label
                                >
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="form-floating mb-3">
                                <input
                                    type="number"
                                    class="form-control"
                                    id="length"
                                    placeholder="length"
                                />
                                <label for="length"
                                    >Length</label
                                >
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="form-floating mb-3">
                                <input
                                    type="number"
                                    class="form-control"
                                    id="qty"
                                    placeholder="quantity"
                                />
                                <label for="qty"
                                    >Quantity</label
                                >
                            </div>
                        </div>
                        <div class="col-md-1 mx-auto">
                            <div
                                class="btn btn-danger btn-block"
                                onclick="delete_material(this)"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    class="bi bi-trash-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);
    }

    $('select').off('change'); // Remove existing event listener
    $('select').on('change', function () { $(this).update_disabled() }); // Bind new one with refernce to dropdown
    // Find last dropdown row
    // Update the disabled fields with reference to the dropdown
    $(this).find('select#materialSelect').last().each(function () { $($(this)).update_disabled(); });
};

function populate_materials(piece, elem) {
    // Piece and elem are used to target and fill a defined material
    // This is used when editing a project
    if (piece != undefined || piece != null) { // If rendering a defined material
        // Find last dropdown
        $(elem).find('select#materialSelect').last().each(function () {
            // Loop through materials
            for (let i = 0; i < materials.length; i++) {
                // Append each option to the target element
                $(this).append(`<option value="${materials[i].id}">${materials[i].name}</option>`);
            }
        });

        // Set the value of the dropdown
        $(elem).find('select#materialSelect').last().val(piece.material)
    } else { // Blank material
        let options = ''; // String to return
        for (let i = 0; i < materials.length; i++) { // Loop through material
            // Append the option to the return string
            options += `<option value="${materials[i].id}">${materials[i].name}</option>`;
        }

        return options; // Return the string
    }

}

// Function to delete the material row
// Accepts reference to the row as an argument
// Finds the parent container
// Checks if there is more than one material
// > 1 - removes the row
// < 1 prevents the row being removed
function delete_material(elem) { $(elem).parents('div.material-container').find('div#material-card').length > 1 ? $(elem).parents('div#material-card').remove() : console.log('How about no...') };

window.onload = () => { // On window load
    $.ajax({
        async: false, //We do not want this to be asynchonous, otherwise data will not be returned
        url: "/material/list",
        success: function (response) {
            materials = response; // Set global materials variable (because I couldn't be bothered parseing it aroud)
        },
        error: function (error) {
            //Oh no! There was an error, print it.
            console.log(error);
        }
    });

    let editProject = JSON.parse(localStorage.getItem('project')); // Get the project from local storate
    console.log(editProject);

    if (editProject == null || editProject == undefined) { // Not editing an existing project
        $('.material-container').newMaterial() // Add first material box
        $('#save-btn').click(() => { add_project() }); // Add an action to the save button
        $('#delete-btn').click(() => { delete_project() });
    } else { // Editing an existing project
        // Set various fields to defined 
        $('#projectName').val(editProject.name);
        $('#projectClass').val(editProject.class);
        $('#projectDesc').val(editProject.desc);

        $('#delete-btn').click(() => { delete_project(editProject["_id"].$oid) });
        console.log(typeof(editProject["_id"].$oid));

        // Loop through materials and spawn a new row parseing the material
        editProject.pieces.forEach(function (piece) {
            $('.material-container').newMaterial(piece);
        });

        // Save ID to session storage for when you submit the edit
        sessionStorage.setItem('_id', editProject["_id"]["$oid"]);

        $('#save-btn').click(() => { edit_project() }); // Add an action to the save button
        localStorage.removeItem('project'); // Remove object from local storage
    }
};

function add_project() {
    let project = { // Define project JSON
        _id: undefined,
        name: $('#projectName').val(), // Get name
        class: $('#projectClass').val(), // Get class
        desc: $('#projectDesc').val(), // Get description
        thumb: 'https://i.quotev.com/img/q/u/18/10/21/g7fp3vu7ce.jpg', // Set image URL
        pieces: [], // Define pieces
        complete: false // Not complete
    }

    // Loop through all material rows
    $('.material-container div.card').each(function () {
        let material = $(this).find('#materialSelect').val(); // Get selected material

        let piece = {
            material: material, // Material
            type: materials.find(x => x.id === material).type, // Who even knows at this point
            w: Number($(this).find('#width').val()), // Width
            l: Number($(this).find('#length').val()), // Lenght
            h: Number($(this).find('#height').val()), // Height
            qty: Number($(this).find('#qty').val()) // Quantity
        }

        project.pieces.push(piece); // Push object to pieces array
    });

    $.ajax({
        async: false, //We do not want this to be asynchonous, otherwise data will not be returned
        method: "POST",
        url: "/projects/add",
        data: JSON.stringify({
            credential: localStorage.getItem('IDToken'),
            data: project,
        }),
        contentType: 'application/json',
        success: function (response) {
            if (response == 'success') {
                window.location.href = "http://localhost:5500/"
            }
        },
        error: function (error) {
            //Oh no! There was an error, print it.
            console.log(error);

        }
    });
}

function edit_project() {
    let project = {
        _id: sessionStorage.getItem('_id'),
        name: $('#projectName').val(),
        class: $('#projectClass').val(),
        desc: $('#projectDesc').val(),
        thumb: 'https://i.quotev.com/img/q/u/18/10/21/g7fp3vu7ce.jpg',
        pieces: [],
        complete: false
    }

    $('.material-container div.card').each(function () {
        let material = $(this).find('#materialSelect').val();

        let piece = {
            material: material,
            type: materials.find(x => x.id === material).type,
            w: Number($(this).find('#width').val()),
            l: Number($(this).find('#length').val()),
            h: Number($(this).find('#height').val()),
            qty: Number($(this).find('#qty').val())
        }

        project.pieces.push(piece);
    });

    $.ajax({
        async: false, //We do not want this to be asynchonous, otherwise data will not be returned
        method: "POST",
        url: "/projects/edit",
        data: JSON.stringify({
            credential: localStorage.getItem('IDToken'),
            data: project,
        }),
        contentType: 'application/json',
        success: function (response) {
            if (response == 'success') {
                window.location.href = "http://localhost:5500/"
            }
        },
        error: function (error) {
            //Oh no! There was an error, print it.
            console.log(error);

        }
    });
}