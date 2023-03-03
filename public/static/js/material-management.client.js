function resetInputs() {
    console.log('Input values reset.')
    $('#type').val('');
    $('#name').val('');
    $('#code').val('');
    $('#length').val('');
    $('#width').val('');
    $('#thickness').val('');

    window.location.href = "/manage";
}

function deleteMaterial(material) {
    console.log(`Deleting material: ${material}`);
    $.post('/api/materials/delete', { material: material }, function (res) {
        console.log(res);
        location.reload();
    }).fail(function (response) {
        alert('Error: ' + response.responseText);
    });
}

function addMaterial(id) {
    console.log('Adding material.');

    console.log(id)

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

    if (typeof id == 'undefined') {
        $.post('/api/materials/add', material, function (res) {
            console.log(res);
            resetInputs();
        }).fail(function (response) {
            alert('Error: ' + response.responseText);
        });
    } else {
        let body = {
            id: id,
            material: material
        }
        $.post('/api/materials/edit', body, function (res) {
            console.log(res);
            resetInputs();
        }).fail(function (response) {
            alert('Error: ' + response.responseText);
        });        
    }
    console.log(material);
}

function editMaterial(id) {
    console.log('Editing Material:', id);
    window.location.href = `/manage?id=${id}`;
}