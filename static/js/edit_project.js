function edit_project(project) {
    localStorage.setItem('project', JSON.stringify(project));
    window.location.href='form';
}