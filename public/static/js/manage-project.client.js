/* Delete a piece entry */
$.fn.deletePiece = function () {
  "use strict";

  let piece = $(this);

  piece.closest('li').remove();
  $('#componentTitle').text(`Components (${$('.pieces li').length})`);
};

/* Insert a new piece into the selected div or element */
$.fn.newPiece = function () {
  "use strict";

  let container = $(this);

  container.append(
    `
    <li>
      <div class="grid">
        <select id="material" required>
          <option value="" selected hidden disabled>Material</option>
          <option value="materialcode">Material Name</option>
        </select>
        <input id="length" type="number" placeholder="Length" required>
        <input id="width" type="number" placeholder="Width" disabled>
        <input id="quantity" type="number" placeholder="Qty" min=0 max=16 required>
        <a class="round remove" title="remove piece" onclick="$(this).deletePiece()"><box-icon name="trash" color=var(--form-element-invalid-active-border-color)></box-icon></a>
        <a class="round add" title="add new piece" onclick='$(".pieces").newPiece()'><box-icon name="plus" color=var(--contrast-hover)></box-icon></a>
      </div>
    </li>
    `
  );

  $('#componentTitle').text(`Components (${$('.pieces li').length})`)
};

/* Validate any required input fields, return true if valid */
$.fn.validate = function () {
  "use strict";

  /* Get the values of all inputs which are required (those which are not are disabled) */
  let inputs = $(':input[required]');

  var passed = 0;

  inputs.each(function (index) {
    console.log($(this).val());

    if ($(this).val()) {
      console.log(`Element with index ${index} has value`);

      let type = $(this).attr('type');
      let value = $(this).val();

      switch (type) {
        case "text":
          console.log("Input has type text");
          $(this).val(value.replace(/[^a-zA-Z0-9 ]/g, '').trim());
          $(this).attr("aria-invalid", false);
          break;
        case "number":
          console.log("Input has type number");
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
          console.log(type);
          break;
      }

    } else {
      console.log(`Element with index ${index} does not have value`);
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
