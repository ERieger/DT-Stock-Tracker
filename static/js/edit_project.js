function edit_project(project) { 
    // Parse the project to the form page using local storage
    localStorage.setItem('project', JSON.stringify(project));
    window.location.href='form';
}