let materials;

function add_project() {
    let project = {
        _id: undefined,
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
            console.log(error); newMaterial

        }
    });
}

$.fn.update_disabled = function () {
    let parents = $(this).parentsUntil('div.card-body');
    let inputs = {
        width: $(parents[2]).find('input#width'),
        height: $(parents[2]).find('input#height'),
        length: $(parents[2]).find('input#length'),
        selects: $(parents[2]).find('select#materialSelect')
    }

    $(parents).find('input').each(function () {
        $(this).prop('disabled', false);
    });

    for (let i = 0; i < materials.length; i++) {
        if (materials[i].id == $(inputs.selects).val()) {
            switch (materials[i].type) {
                case 1: // Board
                    $(inputs.height).prop('disabled', true);
                    $(inputs.height).val(undefined);
                    console.log('disable t');
                    break;

                case 2: // Plank
                    $(inputs.width).prop('disabled', true);
                    $(inputs.width).val(undefined);
                    $(inputs.height).prop('disabled', true);
                    $(inputs.height).val(undefined);
                    console.log('disable wt');
                    break;

                case 3: // Dowel
                    $(inputs.width).prop('disabled', true);
                    $(inputs.width).val(undefined);
                    $(inputs.height).prop('disabled', true);
                    $(inputs.height).val(undefined);
                    console.log('disable wt');
                    break;
            }
        } else {
            continue;
        }
    }
}

$.fn.newMaterial = function (piece) {
    if (piece != undefined || piece != null) { // Rendering a piece
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
                                onclick="$(this).parents('div.material-container').find('div#material-card').length > 1 ? $(this).parents('div#material-card').remove() : console.log('How about no...')"
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

        populate_materials(piece, this);
    } else { // Rendering a blank piece
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
                                onclick="$(this).parents('div.material-container').find('div#material-card').length > 1 ? $(this).parents('div#material-card').remove() : console.log('How about no...')"
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


    $('select').off('change');
    $('select').on('change', function () { $(this).update_disabled() });
    $(this).find('select#materialSelect').last().each(function () {
        $($(this)).update_disabled(); 
        console.log($(this));
    });
};

function populate_materials(piece, elem) {
    let options = '';

    if (piece != undefined || piece != null) {
        $(elem).find('select#materialSelect').last().each(function () {
            for (let i = 0; i < materials.length; i++) {
                $(this).append(`<option value="${materials[i].id}">${materials[i].name}</option>`);
            }
        });
        $(elem).find('select#materialSelect').last().val(piece.material)
        // console.log($(elem).find('select#materialSelect').last().val());
    } else {
        for (let i = 0; i < materials.length; i++) {
            options += `<option value="${materials[i].id}">${materials[i].name}</option>`;
        }

        return options;
    }

}

function delete_material(elem) { $(elem).parents('div.material-container').find('div#material-card').length > 1 ? $(elem).parents('div#material-card').remove() : console.log('How about no...') };

window.onload = () => {
    $('#save-btn').click(() => { add_project() }); // Add an action to the save button
    $.ajax({
        async: false, //We do not want this to be asynchonous, otherwise data will not be returned
        url: "/material/list",
        success: function (response) {
            console.log(response);
            materials = response;
        },
        error: function (error) {
            //Oh no! There was an error, print it.
            console.log(error);
        }
    });

    let editProject = JSON.parse(localStorage.getItem('project'));

    if (editProject == null || editProject == undefined) { // Not editing an existing project
        $('.material-container').newMaterial() // Add first material box
    } else { // Editing an existing project
        $('#projectName').val(editProject.name);
        $('#projectClass').val(editProject.class);
        $('#projectDesc').val(editProject.desc);

        editProject.pieces.forEach(function (piece) {
            $('.material-container').newMaterial(piece);
        });

        localStorage.removeItem('project');
    }
};
