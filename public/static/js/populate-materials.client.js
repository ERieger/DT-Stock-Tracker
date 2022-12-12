function populate_materials() {
    let options = ''; // String to return
    for (let i = 0; i < materials.length; i++) { // Loop through material
        // Append the option to the return string
        options += `<option value="${materials[i].id}">${materials[i].name}</option>`;
    }

    return options; // Return the string
}