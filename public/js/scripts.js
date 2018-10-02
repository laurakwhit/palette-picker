function generateGem() {
  $('.top-left-triangle').css('border-bottom-color', generateColor);
  $('.top-center-triangle').css('border-top-color', generateColor);
  $('.top-right-triangle').css('border-bottom-color', generateColor);
  $('.bottom-left-triangle').css('border-top-color', generateColor);
  $('.bottom-right-triangle').css('border-top-color', generateColor);
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
  const project = `<article class="right-side__project">
  <h2>${$(this).find('input').val().toUpperCase()}</h2>
  </article>`;
  $('.right-side__projects').prepend(project); 
  $(this).find('input').val('');
}

$(window).on('load', generateGem);
$('.left-side__new-gem-btn').on('click', generateGem);
$('.left-side__diamond img').on('click', lockColor);
$('.right-side__new-project-form').on('submit', createProject);
