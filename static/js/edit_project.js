function edit_project(project) {
    // Parse the project to the form page using local storage
    localStorage.setItem('project', JSON.stringify(project));
    window.location.href = 'form';
}

function delete_project(project) {
    if (project != undefined || project != null) {
        $.ajax({
            async: false, //We do not want this to be asynchonous, otherwise data will not be returned
            method: "POST",
            url: "/projects/delete",
            data: JSON.stringify({
                credential: localStorage.getItem('IDToken'),
                data: project,
            }),
            contentType: 'application/json',
            success: function (data) {
                console.log(data);
                window.location.href = '/';
            },
            error: function (error) {
                //Oh no! There was an error, print it.
                console.log(error);
            },
        });
    } else {
        window.location.href = '/';
    }
}