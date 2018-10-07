
const fetchProjects = async () => {
  try {
    const response = await fetch('/api/v1/projects');
    const projects = await response.json();

    if (projects) {
      projects.forEach( project => {
        createProject(project.name, project.id);
        fetchPalettes(project.id);
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

const fetchPalettes = async (projectId) => {
  try {
    const response = await fetch(`/api/v1/palettes/${projectId}`);
    const projectPalettes = await response.json();

    if (projectPalettes.length) {
      projectPalettes.forEach( palette => {
        let colors = [];
        for (i = 1; i < 6; i++) {
          colors.push(palette[`color${i}`]);
        }
        createGemPalette(palette.id, projectId, palette.name, colors);
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

const displayProjectDropdown = (event) => {
  event.preventDefault();
  $('.gem-form__dropdown-content').toggleClass('show');
  $('.gem-form__dropbtn').toggleClass('up-arrow');
}

function selectProject() {
  $('.gem-form__dropbtn').text($(this).text());
  $('.gem-form__dropbtn').attr('data-id', $(this).attr('data-id'));
  $('.gem-form__dropdown-content').toggleClass('show');
  $('.gem-form__dropbtn').toggleClass('up-arrow');
}

$(window).on('load', fetchProjects);
$('.gem-form__dropbtn').on('click', displayProjectDropdown);
$('.gem-form__dropdown-content').on('click', 'li', selectProject);
