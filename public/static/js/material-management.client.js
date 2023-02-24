function resetInputs() {
    console.log('Input values reset.')
    $('#type').val('');
    $('#name').val('');
    $('#code').val('');
    $('#length').val('');
    $('#width').val('');
    $('#thickness').val('');
}

function deleteMaterial(material) {
    console.log(`Deleting material: ${material}`);
    $.post('/api/materials/delete', {material: material}, function (res) {
        console.log(res);
        location.reload();
    }).fail(function(response) {
        alert('Error: ' + response.responseText);
    });
}

function addMaterial() {
    console.log('Adding material.');

    let material = {
        type: $('#type').val(),
        id: $('#code').val(),
        name: $('#name').val(),
        dim: {
            l: $('#length').val(),
            w: $('#width').val(),
            h: $('#height').val()
        }
    }

    $.post('/api/materials/add', material, function (res) {
        console.log(res);
        location.reload();
    }).fail(function(response) {
        alert('Error: ' + response.responseText);
    });

    console.log(material);
}