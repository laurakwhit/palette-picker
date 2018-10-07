
function submitProject(event) {
  event.preventDefault();
  const name = $(this).find('input').val().toUpperCase();

  if (!name) {
    return alert('Please enter a project name.');
  }

  for (i = 1; i <= $('.right-side__project').find('h2').length; i++) {
    if (name === $(`#${i}`).find('h2').text()) {
      return alert('A project with that name already exists, please choose another name.')
    }
  }
  saveProject(name);
  $(this).find('input').val('');
}

const saveProject = async (name) => {
  try {
    const response = await fetch('/api/v1/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    const project = await response.json();
    
    createProject(name, project.id);
  } catch (error) {
    throw new Error(error.message);
  }
}

function createProject(name, id) {
  const project = `<article id="${id}" class="right-side__project">
    <h2>${name}</h2>
    <div class="right-side__project--gems"></div>
  </article>`;
  const dropdownItem = `<li data-id="${id}">${name}</li>`;

  $('.right-side__projects').prepend(project); 
  $('.gem-form__dropdown-content').prepend(dropdownItem);
}

$('.right-side__new-project-form').on('submit', submitProject);
