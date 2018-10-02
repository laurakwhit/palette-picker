class Gem {
  constructor() {
    this.colors = this.generateColors();
    this.setGemColors();
  }

  generateColors() {
    let colors = [];

    for (let i = 0; i < 5; i++) {
      colors.push(this.generateHexCode())
    }
    return colors;
  }

  generateHexCode() {
    const characters = "0123456789ABCDEF"; 
    let color = '#'; 

    for (let i = 0; i < 6; i++)  {
      color += characters[(Math.floor(Math.random() * 16))];
    }
    return color; 
  }

  setGemColors() {
    $('.top-left-triangle').css('border-bottom-color', this.colors[0]);
    $('.top-left-triangle h4').text(this.colors[0]);
    $('.top-center-triangle').css('border-top-color', this.colors[1]);
    $('.top-center-triangle h4').text(this.colors[1]);
    $('.top-right-triangle').css('border-bottom-color', this.colors[2]);
    $('.top-right-triangle h4').text(this.colors[2]);
    $('.bottom-left-triangle').css('border-top-color', this.colors[3]);
    $('.bottom-left-triangle h4').text(this.colors[3]);
    $('.bottom-right-triangle').css('border-top-color', this.colors[4]);
    $('.bottom-right-triangle h4').text(this.colors[4]);
  }
}

$('.left-side__new-gem-btn').on('click', () => new Gem())
$(window).on('load', () => new Gem())
