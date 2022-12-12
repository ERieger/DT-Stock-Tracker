function add_project() {
    let project = { // Define project JSON
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

    console.log('Adding project:', project)

    $.post('/api/projects/add', project, function (response) {
        console.log(response)
        window.location.href = 'http://localhost:3000/dashboard'
    });
}