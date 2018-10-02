function generateGem() {
  $('.top-left-triangle-main').css('border-bottom-color', generateColor);
  $('.top-center-triangle-main').css('border-top-color', generateColor);
  $('.top-right-triangle-main').css('border-bottom-color', generateColor);
  $('.bottom-left-triangle-main').css('border-top-color', generateColor);
  $('.bottom-right-triangle-main').css('border-top-color', generateColor);
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

function lockColor() {
  if ($(this).attr('src') === './assets/unlocked.svg') {
    $(this).attr('src', './assets/locked.svg')
  } else {
    $(this).attr('src', './assets/unlocked.svg')
  }
}

function createProject(event) {
  event.preventDefault();
  const name = $(this).find('input').val().toUpperCase();
  const project = `<article class="right-side__project">
    <h2>${name}</h2>
    <div class="right-side__project--gems"></div>
  </article>`;
  const dropdownItem = `<li>${name}</li>`
  $('.right-side__projects').prepend(project); 
  $('.gem-form__dropdown-content').prepend(dropdownItem)
  $(this).find('input').val('');
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
    createGemPalette(gemName);
    $('.gem-form__dropbtn').text('SELECT PROJECT');
    $('.right-side__new-gem-form').find('input').val('');
  }
}

function createGemPalette(gemName) {
  const gem = ` <div class="right-side__project-gem">
    <div class='project-gem__diamond'>
      <div class='top-triangles'>
        <div class='top-left-triangle top-left-triangle-${gemName}'></div>
        <div class='top-center-triangle top-center-triangle-${gemName}'></div>
        <div class=' top-right-triangle top-right-triangle-${gemName}'></div>
      </div>
      <div class='bottom-triangles'>
        <div class='bottom-left-triangle bottom-left-triangle-${gemName}'></div>
        <div class='bottom-right-triangle bottom-right-triangle-${gemName}'></div>
      </div>
    </div>
    <h4>${gemName}</h4>
    </div>
  </div>`;
  $('.right-side__project--gems').prepend(gem);
  $(`.top-left-triangle-${gemName}`).css('border-bottom-color', $('.top-left-triangle').find('h4').text());
  $(`.top-center-triangle-${gemName}`).css('border-top-color', $('.top-center-triangle').find('h4').text());
  // $(`.top-right-triangle-${gemName}`).css('border-bottom-color', $('.top-right-triangle').find('h4').text());
  $(`.top-right-triangle-${gemName}`).css('border-bottom-color', 'black');
  // $(`.bottom-left-triangle-${gemName}`).css('border-top-color', $('.bottom-left-triangle').find('h4').text());
  $(`.bottom-left-triangle-${gemName}`).css('border-top-color', 'black');
  // $(`.bottom-right-triangle-${gemName}`).css('border-top-color', $('.bottom-right-triangle').find('h4').text());
  $(`.bottom-right-triangle-${gemName}`).css('border-top-color', 'black');
}

$(window).on('load', generateGem);
$('.left-side__new-gem-btn').on('click', generateGem);
$('.left-side__diamond img').on('click', lockColor);
$('.right-side__new-project-form').on('submit', createProject);
$('.gem-form__dropbtn').on('click', displayProjectDropdown);
$('.right-side__new-gem-form').on('submit', saveGemPalette);
$('.gem-form__dropdown-content').on('click', 'li', selectProject)
