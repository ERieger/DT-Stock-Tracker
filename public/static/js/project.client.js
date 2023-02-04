let dropdownText = '';

/* Delete a piece entry */
$.fn.deletePiece = function () {
  "use strict";

  let piece = $(this);

  piece.closest('li').remove();
  $('#componentTitle').text(`Components (${$('.pieces li').length})`);
};

/* Create dropdown options for materials */
$.fn.genDrops = function (code) {
  "use strict";

  let materials;

  $.ajax({
    url: '/api/materials/list',
    method: "GET",
    async: false,
    success: function (data) {
      materials = data;
    },
    error: function (err) {
      console.error(err);
    }
  });

  materials.forEach((material) => {
    dropdownText += `<option value="${material.id}" type="${material.type}">${material.name}</option>`;
  });
};

function updateFields(dropdown) {
  let materialType = dropdown.querySelector(':checked').getAttribute('type');

  if (materialType == 0) {
    dropdown.parentElement.querySelector('#width').disabled = false;
    dropdown.parentElement.querySelector('#width').required = true;
  } else {
    dropdown.parentElement.querySelector('#width').disabled = true;
    dropdown.parentElement.querySelector('#width').required = false;
  }
}

/* Insert a new piece into the selected div or element */
$.fn.newPiece = function (piece) {
  "use strict";

  let container = $(this);

  if (piece == undefined) {
    container.append(
      `
      <li>
        <div class="grid">
          <select id="material" onchange='updateFields(this);' required>
            <option selected hidden disabled>Material</option>
            ${dropdownText}
          </select>
          <input id="length" type="number" placeholder="Length" required>
          <input id="width" type="number" placeholder="Width" required>
          <input id="quantity" type="number" placeholder="Qty" min=0 max=16 required>
          <a class="round remove" title="remove piece" onclick="$(this).deletePiece()"><box-icon name="trash" color=var(--form-element-invalid-active-border-color)></box-icon></a>
          <a class="round add" title="add new piece" onclick='$(".pieces").newPiece()'><box-icon name="plus" color=var(--contrast-hover)></box-icon></a>
        </div>
      </li>
      `
    );
  } else if (piece != undefined) {
    console.log(piece);
    container.append(
      `
      <li>
        <div class="grid">
          <select id="material" onchange='updateFields(this);' required>
            ${dropdownText}
          </select>
          <input id="length" type="number" placeholder="Length" value=${piece.dim.l} required>
          <input id="width" type="number" placeholder="Width" ${piece.dim.w ? "value="+piece.dim.w : ''} ${piece.dim.w ? '' : 'disabled' }>
          <input id="quantity" type="number" placeholder="Qty" min=0 max=16 value=${piece.qty} required>
          <a class="round remove" title="remove piece" onclick="$(this).deletePiece()"><box-icon name="trash" color=var(--form-element-invalid-active-border-color)></box-icon></a>
          <a class="round add" title="add new piece" onclick='$(".pieces").newPiece()'><box-icon name="plus" color=var(--contrast-hover)></box-icon></a>
        </div>
      </li>
      `
    );
  }
  $('#componentTitle').text(`Components (${$('.pieces li').length})`)
};

/* Validate any required input fields, return true if valid */
$.fn.validate = function () {
  "use strict";

  /* Get the values of all inputs which are required (those which are not are disabled) */
  let inputs = $(':input[required]');

  var passed = 0;

  inputs.each(function (index) {
    if ($(this).val()) {

      let type = $(this).attr('type');
      let value = $(this).val();

      switch (type) {
        case "text":
          $(this).val(value.replace(/[^a-zA-Z0-9 ]/g, '').trim());
          $(this).attr("aria-invalid", false);
          break;
        case "number":
          try {
            $(this).val(parseInt(value));
            $(this).attr("aria-invalid", false);
          }
          catch {
            $(this).attr("aria-invalid", true);
            passed += 1;
            break;
          }
          break;
        default:
          $(this).attr("aria-invalid", false);
          break;
      }

    } else {
      $(this).attr("aria-invalid", true);
      passed += 1;
    }
  });

  /* If passed is zero, all inputs are valid */
  if (passed == 0) {
    return true;
  } else {
    return false;
  }
};

$.fn.save = function () {
  "use strict";

  if ($().validate() == true) {
    let pieces = $('.pieces :input');
    
    let pieceCollection = [];

    for (var i=0; i<pieces.length; i+=4) {
      let piece = {
        material: pieces[i].value,
        type: pieces[i].options[pieces[i].selectedIndex].getAttribute('type'),
        qty: pieces[i+3].value,
        dim: {
          l: pieces[i+1].value,
          w: pieces[i+2].value
        }
      };

      pieceCollection.push(piece);
    }

    let project = {
      name: $('#title').val(),
      desc: $('#desc').val(),
      class: $('#class').val(),
      thumb: null,
      pieces: pieceCollection,
      qty: 1,
      status: 'incomplete'
    };

    if ($('main.container').attr('projectId') == undefined) {
      $.ajax({
        url: '/api/projects/add',
        method: "POST",
        data: project,
        success: function (data) {
          $('main.container').attr('projectId', data);
          return true;
        },
        error: function (err) {
          console.error(err);
        }
      });
    } else {
      $.ajax({
        url: '/api/projects/update',
        method: "POST",
        data: {
          id: $('main.container').attr('projectId'),
          project: project,
        },
        success: function (data) {
          console.log(data);
          return true;
        },
        error: function (err) {
          console.error(err);
        }
      });
    }
  }
};

$.fn.order = function () {
  $.ajax({
    url: '/api/projects/order',
    method: 'POST',
    success: function (data) {
      console.log(data);
    },
    error: function (err) {
      console.error(err);
    }
  });
};

$.fn.orderOne = function () {
  $.ajax({
    url: '/api/projects/orderone',
    method: 'POST',
    data: { id: $('main.container').attr('projectId') },
    success: function (data) {
      console.log(data);
    },
    error: function (err) {
      console.error(err);
    }
  });
};

$.fn.selectClass = function (className) {
  var select = document.getElementById("class");

  for (var i=0; i<select.options.length; i++) {
    if (select.options[i].value == className) {
      select.options[i].selected = true;
    }
  }
}

$(document).ready(function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  let edit = urlParams.get('edit');

  if (edit=='true') {
    let id = urlParams.get('id');

    $.ajax({
      url: '/api/projects/fetch',
      method: 'POST',
      data: { id: id },
      success: function (data) {
        console.log(data);

        console.log(data.pieces);

        $('#title').val(data.name);
        $().selectClass(data.class);
        $('#desc').val(data.desc);
        data.pieces.forEach((piece) => {
          $('.pieces').newPiece(piece);
        });
      },
      error: function (err) {
        console.error(err);
      }
    });
  } else {
    $('.pieces').newPiece();
  }
});