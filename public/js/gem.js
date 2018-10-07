
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

function generateColor() {
  const characters = "0123456789ABCDEF"; 
  let color = '#'; 
  
  if ($(this).find('img').attr('src') === './assets/locked.svg') {
    return $(this).find('h4').text();
  }

  for (let i = 0; i < 6; i++)  {
    color += characters[(Math.floor(Math.random() * 16))];
  }
  $(this).find('h4').text(color);
  return color; 
}

const setHexCodes = (colors) => {
  $('.top-left-triangle-main').find('h4').text(colors[0]);
  $('.top-center-triangle-main').find('h4').text(colors[1]);
  $('.top-right-triangle-main').find('h4').text(colors[2]);
  $('.bottom-left-triangle-main').find('h4').text(colors[3]);
  $('.bottom-right-triangle-main').find('h4').text(colors[4]);
}

function lockColor() {
  if ($(this).attr('src') === './assets/unlocked.svg') {
    $(this).attr('src', './assets/locked.svg');
  } else {
    $(this).attr('src', './assets/unlocked.svg');
  }
}

const resetLocks = () => {
  for (i = 1; i < 6; i++) {
    $(`#lock${i}`).attr('src', './assets/unlocked.svg'); 
  }
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

$(window).on('load', generateGem);
$('.left-side__new-gem-btn').on('click', generateGem);
$('.left-side__diamond').on('click', 'img', lockColor);
$('.right-side').on('click', '.project-gem__diamond', setGemToPalette);