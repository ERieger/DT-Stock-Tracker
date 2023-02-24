// Show a particular category of project
function show(category) {
    let container = document.querySelector('.projectInfo');
    let incomplete = document.querySelector('.incomplete');
    let pending = document.querySelector('.pending');
    let complete = document.querySelector('.complete');

    switch (category) {
        case 'pending':
            container.setAttribute('activeCategory', 'pending');

            incomplete.style.display = 'none';
            pending.style.display = 'block';
            complete.style.display = 'none';
            break;
        case 'complete':
            container.setAttribute('activeCategory', 'complete');

            incomplete.style.display = 'none';
            pending.style.display = 'none';
            complete.style.display = 'block';
            break;
        default:
            container.setAttribute('activeCategory', 'incomplete');

            incomplete.style.display = 'block';
            pending.style.display = 'none';
            complete.style.display = 'none';
            break;
    }
}

//Move to the next project in the category
function next() {
    let category = document.querySelector('.projectInfo').getAttribute('activeCategory');
    let container = document.querySelector(`.${category}`);

    for (var i=0; i<container.childElementCount-1; i++) {
        let child = container.children[i];
        let nextchild = container.children[i+1];

        let display = child.style.display;

        if (display != 'none') {
            child.style.display = 'none';
            nextchild.style.display = '';
            break;
        }
    }
}

//Move to the previous project in the category
function previous() {
    let category = document.querySelector('.projectInfo').getAttribute('activeCategory');
    let container = document.querySelector(`.${category}`);

    for (var i=container.childElementCount-1; i>0; i--) {
        let child = container.children[i];
        let nextchild = container.children[i-1];

        let display = child.style.display;

        if (display != 'none') {
            child.style.display = 'none';
            nextchild.style.display = '';
            break;
        }
    }
}

function edit() {
    let nodes = document.querySelectorAll('.incomplete div.grid.details');

    var project;

    nodes.forEach((node) => {
        if (node.style.display == '') {
            project = node.id;
        }
    });

    window.location.href=`/project?edit=true&id=${project}`
}
