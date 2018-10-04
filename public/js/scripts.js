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
  const project = `<article data-id="${id}" class="right-side__project">
    <h2>${name}</h2>
    <div class="right-side__project--gems"></div>
  </article>`;
  const dropdownItem = `<li>${name}</li>`;

  $('.right-side__projects').prepend(project); 
  $('.gem-form__dropdown-content').prepend(dropdownItem)
}

function displayProjectDropdown(event) {
  event.preventDefault();
  $('.gem-form__dropdown-content').toggleClass('show');
}

function selectProject() {
  $('.gem-form__dropbtn').text($(this).text());
  $('.gem-form__dropdown-content').toggleClass('show');
}

function saveGemPalette(event) {
  event.preventDefault();
  let project = $('.gem-form__dropbtn').text();
  let gemName = $('.right-side__new-gem-form').find('input').val();

  if ( project === 'SELECT PROJECT' || gemName === '') {
    alert('Please select a project and give your gem a name.')
  } else {
    createGemPalette(project, gemName);
    $('.gem-form__dropbtn').text('SELECT PROJECT');
    $('.right-side__new-gem-form').find('input').val('');
  }
}

function createGemPalette(project, gemName, colors = []) {
  project = project.replace(/\s/g, '');
  gemName = gemName.replace(/\s/g, '');
  const gem = ` <div class="right-side__project-gem">
    <button class="project-gem__delete-btn">X</button>
    <div class='project-gem__diamond'>
      <div class='top-triangles'>
        <div class='top-left-triangle top-left-triangle-${project}__${gemName}'></div>
        <div class='top-center-triangle top-center-triangle-${project}__${gemName}'></div>
        <div class=' top-right-triangle top-right-triangle-${project}__${gemName}'></div>
      </div>
      <div class='bottom-triangles'>
        <div class='bottom-left-triangle bottom-left-triangle-${project}__${gemName}'></div>
        <div class='bottom-right-triangle bottom-right-triangle-${project}__${gemName}'></div>
      </div>
    </div>
    <h4>${gemName}</h4>
    </div>
  </div>`;
  $(`.${project}`).prepend(gem);
  $(`.top-left-triangle-${project}__${gemName}`).css('border-bottom-color', colors[0] || $('.top-left-triangle').find('h4').text());
  $(`.top-center-triangle-${project}__${gemName}`).css('border-top-color', colors[1] || $('.top-center-triangle').find('h4').text());
  $(`.top-right-triangle-${project}__${gemName}`).css('border-bottom-color', colors[2] || $('.top-right-triangle').find('h4').text());
  $(`.bottom-left-triangle-${project}__${gemName}`).css('border-top-color', colors[3] || $('.bottom-left-triangle').find('h4').text());
  $(`.bottom-right-triangle-${project}__${gemName}`).css('border-top-color', colors[4] || $('.bottom-right-triangle').find('h4').text());
}

function setGemToPalette() {
  const projectName = $(this).closest('.right-side__projects').find('h2').text();
  const paletteName = $(this).siblings('h4').text();

  const colors = ['#C4AD51', '#DD31BB', '#39695', '#54437F', '#654429']; //temporary color, will pull from db
  generateGem(colors);
  resetLocks()
}

function deleteGemPalette() {
  $(this).parent('.right-side__project-gem').remove();
}

const fetchProjects = async () =>{
  const response = await fetch('/api/v1/projects');
  const projects = await response.json();
  if (projects) {
    fetchPalettes(projects[0])
    projects.forEach( project => {
      createProject(project.name)
      // fetchPalettes(project)
    });
  }
}

const fetchPalettes = async (project) => {
  const response = await fetch(`/api/v1/palettes/${project.id}`);
  const projectPalettes = await response.json();
  projectPalettes.forEach( palette => {
    let colors = [];
    for (i = 1; i < 6; i++) {
      colors.push(palette[`color${i}`]);
    }
    createGemPalette(project.name, palette.name, colors)
  });
}

const fetchPalette = async(paletteId) => {
  const response = await fetch(`/api/v1/palette/${paletteId}`);
  const palette = await response.json();
}

$(window).on('load', () => {
  generateGem()
  fetchProjects()
});
$('.left-side__new-gem-btn').on('click', generateGem);
$('.left-side__diamond').on('click', 'img', lockColor);
$('.right-side__new-project-form').on('submit', submitProject);
$('.gem-form__dropbtn').on('click', displayProjectDropdown);
$('.right-side__new-gem-form').on('submit', saveGemPalette);
$('.gem-form__dropdown-content').on('click', 'li', selectProject);
$('.right-side').on('click', '.project-gem__diamond', setGemToPalette);
$('.right-side').on('click', '.project-gem__delete-btn', deleteGemPalette);
