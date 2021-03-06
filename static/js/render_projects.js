window.onload = () => {
    if (localStorage.getItem('admin') == 'false') {
        console.log('Not an admin');

        $.ajax({
            async: false, //We do not want this to be asynchonous, otherwise data will not be returned
            method: "POST",
            url: "/projects/return",
            data: String(localStorage.getItem('IDToken')),
            success: function (data) {
                render_projects(JSON.parse(data));
                console.log(JSON.parse(data));
            },
            error: function (error) {
                //Oh no! There was an error, print it.
                console.log(error);
            },
        });
        // Render normal user page
    } else {
        console.log('Admin')
        // Render anything for admin...
    }
};

function render_projects(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].complete == false) { // If project is awaiting fulfillment
            $('#current-album-container').append(`
            <div class="col">
                <div class="card shadow-sm">
                    <img
                        class="bd-placeholder-img card-img-top"
                        width="100%"
                        height="225"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-label="Placeholder: Thumbnail"
                        preserveAspectRatio="xMidYMid slice"
                        focusable="false"
                        src="${data[i].thumb}"
                    >
                    </img>

                <div class="card-body">
                    <h5 class="card-title">
                        ${data[i].name}
                    </h5>
                    <p
                        class="card-text project-preview"
                    >
                        ${data[i].desc}
                    </p>
                    <div
                        class="d-flex justify-content-between align-items-center"
                    >
                        <button
                            type="button"
                            class="btn btn-sm btn-outline-secondary"
                            id="${data[i]["_id"]["$oid"]}"
                        >
                            Edit
                        </button>
                        <small
                            class="text-muted"
                            >ID: ${data[i]["_id"]["$oid"]}</small
                        >
                    </div>
                </div>
            </div>
        </div>`);

            $(`button#${data[i]["_id"]["$oid"]}`).click(function () {
                edit_project(data[i]);
            });
        } else { // Project already fulfilled
            $('#previous-album-container').append(`
            <div class="col">
                <div class="card shadow-sm">
                    <img
                        class="bd-placeholder-img card-img-top"
                        width="100%"
                        height="225"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-label="Placeholder: Thumbnail"
                        preserveAspectRatio="xMidYMid slice"
                        focusable="false"
                        src="${data[i].thumb}"
                    >
                    </img>

                <div class="card-body">
                    <h5 class="card-title">
                        ${data[i].name}
                    </h5>
                    <p
                        class="card-text project-preview"
                    >
                        ${data[i].desc}
                    </p>
                    <div
                        class="d-flex justify-content-between align-items-center"
                    >
                        <small
                            class="text-muted"
                            >ID: ${data[i]["_id"]["$oid"]}</small
                        >
                    </div>
                </div>
            </div>
        </div>`);
        }
    }
}

function return_call(data) {
    return JSON.stringify(data);
}