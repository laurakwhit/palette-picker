function generateGem(colors = []) {
  if (colors) {
    setHexCodes(colors);
  }
  $('.top-left-triangle-main').css('border-bottom-color', colors[0] || generateColor);
  $('.top-center-triangle-main').css('border-top-color', colors[1] || generateColor);
  $('.top-right-triangle-main').css('border-bottom-color', colors[2] || generateColor);
  $('.bottom-left-triangle-main').css('border-top-color', colors[3] || generateColor);
  $('.bottom-right-triangle-main').css('border-top-color', colors[4] || generateColor);
}

function resetLocks() {
  for (i = 1; i < 6; i++) {
    $(`#lock${i}`).attr('src', './assets/unlocked.svg'); 
  }
}

function generateColor() {
  const characters = "0123456789ABCDEF"; 
  let color = '#'; 
  
  if ($(this).find('img').attr('src') === './assets/locked.svg') {
    return $(this).find('h4').text();
  }

  for (let i = 0; i < 6; i++)  {
    color += characters[(Math.floor(Math.random() * 16))];
  }
  $(this).find('h4').text(color)
  return color; 
}

function setHexCodes(colors) {
  $('.top-left-triangle-main').find('h4').text(colors[0]);
  $('.top-center-triangle-main').find('h4').text(colors[1]);
  $('.top-right-triangle-main').find('h4').text(colors[2]);
  $('.bottom-left-triangle-main').find('h4').text(colors[3]);
  $('.bottom-right-triangle-main').find('h4').text(colors[4]);
}

function lockColor() {
  if ($(this).attr('src') === './assets/unlocked.svg') {
    $(this).attr('src', './assets/locked.svg')
  } else {
    $(this).attr('src', './assets/unlocked.svg')
  }
}

function submitProject(event) {
  event.preventDefault();
  const name = $(this).find('input').val().toUpperCase();
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
  $('.gem-form__dropdown-content').prepend(dropdownItem)
}

function displayProjectDropdown(event) {
  event.preventDefault();
  $('.gem-form__dropdown-content').toggleClass('show');
}

function selectProject() {
  $('.gem-form__dropbtn').text($(this).text());
  $('.gem-form__dropbtn').attr('data-id', $(this).attr('data-id'));
  $('.gem-form__dropdown-content').toggleClass('show');
}

function submitGemPalette(event) {
  event.preventDefault();
  let project = $('.gem-form__dropbtn').text();
  let projectId = $('.gem-form__dropbtn').attr('data-id');
  let gemName = $('.right-side__new-gem-form').find('input').val();
  //$('.right-side__diamond').find('h4').text()
  const colors = [ 
    $('.top-left-triangle').find('h4').text(),
    $('.top-center-triangle').find('h4').text(),
    $('.top-right-triangle').find('h4').text(),
    $('.bottom-left-triangle').find('h4').text(),
    $('.bottom-right-triangle').find('h4').text()
  ];

  if ( project === 'SELECT PROJECT' || gemName === '') {
    alert('Please select a project and give your gem a name.')
  } else {
    saveGemPalette(projectId, gemName, colors)
    $('.gem-form__dropbtn').text('SELECT PROJECT');
    $('.right-side__new-gem-form').find('input').val('');
  }
}

const saveGemPalette = async (projectId, name, colors) => {
  try {
    const response = await fetch(`/api/v1/projects/${projectId}/palettes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        name,
        color1: colors[0],
        color2: colors[1],
        color3: colors[2],
        color4: colors[3],
        color5: colors[4],
      })
    });
    const palette = await response.json();
    createGemPalette(palette.id, projectId, name, colors);
  } catch (error) {
    throw new Error(error.message);
  }
}

function createGemPalette(paletteId, projectId, name, colors) {
  const gem = ` <div class="right-side__project-gem">
    <button class="project-gem__delete-btn">X</button>
    <div data-id=${paletteId} class='project-gem__diamond'>
      <div class='top-triangles'>
        <div class='top-left-triangle top-left-triangle__${projectId}-${paletteId}'></div>
        <div class='top-center-triangle top-center-triangle__${projectId}-${paletteId}'></div>
        <div class=' top-right-triangle top-right-triangle__${projectId}-${paletteId}'></div>
      </div>
      <div class='bottom-triangles'>
        <div class='bottom-left-triangle bottom-left-triangle__${projectId}-${paletteId}'></div>
        <div class='bottom-right-triangle bottom-right-triangle__${projectId}-${paletteId}'></div>
      </div>
    </div>
    <h4>${name}</h4>
    </div>
  </div>`;
  $(`#${projectId}`).find('.right-side__project--gems').append(gem);
  $(`.top-left-triangle__${projectId}-${paletteId}`).css('border-bottom-color', colors[0]);
  $(`.top-center-triangle__${projectId}-${paletteId}`).css('border-top-color', colors[1]);
  $(`.top-right-triangle__${projectId}-${paletteId}`).css('border-bottom-color', colors[2]);
  $(`.bottom-left-triangle__${projectId}-${paletteId}`).css('border-top-color', colors[3]);
  $(`.bottom-right-triangle__${projectId}-${paletteId}`).css('border-top-color', colors[4]);
}

const fetchPalette = async(paletteId) => {
  const response = await fetch(`/api/v1/palette/${paletteId}`);
  return await response.json();
}

async function setGemToPalette() {
  const paletteId = $(this).attr('data-id');
  const palette = await fetchPalette(paletteId);
  let colors = [];

  for (i = 1; i < 6; i++) {
    colors.push(palette[`color${i}`]);
  }
  generateGem(colors);
  resetLocks();
}

async function deleteGemPalette() {
  const paletteId = $(this).siblings('.project-gem__diamond').attr('data-id');
  $(this).parent('.right-side__project-gem').remove();
  try {
    await fetch(`/api/v1/palettes/${paletteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

const fetchProjects = async () => {
  try {
    const response = await fetch('/api/v1/projects');
    const projects = await response.json();
    if (projects) {
      projects.forEach( project => {
        createProject(project.name, project.id)
        fetchPalettes(project.id)
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

$(window).on('load', () => {
  generateGem()
  fetchProjects()
});
$('.left-side__new-gem-btn').on('click', generateGem);
$('.left-side__diamond').on('click', 'img', lockColor);
$('.right-side__new-project-form').on('submit', submitProject);
$('.gem-form__dropbtn').on('click', displayProjectDropdown);
$('.right-side__new-gem-form').on('submit', submitGemPalette);
$('.gem-form__dropdown-content').on('click', 'li', selectProject);
$('.right-side').on('click', '.project-gem__diamond', setGemToPalette);
$('.right-side').on('click', '.project-gem__delete-btn', deleteGemPalette);
