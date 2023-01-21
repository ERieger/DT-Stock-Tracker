function delete_project(existing) {
    console.log('Deleting Project.')
    if (existing == false || existing == undefined) {
        window.location.href = "http://localhost:3000/dashboard"
    }
}