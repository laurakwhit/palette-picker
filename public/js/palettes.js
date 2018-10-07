
const submitGemPalette = (event) => {
  event.preventDefault();
  let project = $('.gem-form__dropbtn').text();
  let projectId = $('.gem-form__dropbtn').attr('data-id');
  let gemName = $('.right-side__new-gem-form').find('input').val();
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

const createGemPalette = (paletteId, projectId, name, colors) => {
  const gem = ` <div class="right-side__project-gem">
    <button class="project-gem__delete-btn"></button>
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

$('.right-side__new-gem-form').on('submit', submitGemPalette);
$('.right-side').on('click', '.project-gem__delete-btn', deleteGemPalette);
