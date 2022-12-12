// Define function to add a new material to the project
$.fn.newMaterial = function () { // Accepts object piece as argument
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
                                    step="1"
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
                                    step="1"
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
                                    step="1"
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
                                    step="1"
                                    min="1"
                                    max="20"
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

    $('select').off('change'); // Remove existing event listener
    $('select').on('change', function () { $(this).update_disabled() }); // Bind new one with refernce to dropdown
    // Find last dropdown row
    // Update the disabled fields with reference to the dropdown
    $(this).find('select#materialSelect').last().each(function () { $($(this)).update_disabled(); });
};