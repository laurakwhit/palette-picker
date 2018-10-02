
const generateHexCode = () => {
    const characters = "0123456789ABCDEF"; 
    let color = '#'; 

    for (let i = 0; i < 6; i++)  {
      color += characters[(Math.floor(Math.random() * 16))];
    }
    return color;
}

const setGemColors = () => {
  $('.top-left-triangle').css('border-bottom-color', generateHexCode())
  $('.top-center-triangle').css('border-top-color', generateHexCode())
  $('.top-right-triangle').css('border-bottom-color', generateHexCode())
  $('.bottom-left-triangle').css('border-top-color', generateHexCode())
  $('.bottom-right-triangle').css('border-top-color', generateHexCode())
}

$(window).on('load', setGemColors)
$('.left-side__new-gem-btn').on('click', setGemColors)