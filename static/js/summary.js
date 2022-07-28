$.fn.fetch_summary = function () {
  "use strict";

  let project = $.ajax({
    async: false,
    method: "POST",
    url: "/projects/report",
    success: function (data) {
      return JSON.stringify(data);
    }
  });

  return project.responseJSON;
};

$.fn.create_material_table = function (class_pieces, element) {
  "use strict";

  let table_container = $(this);

  let material = class_pieces[element];

  switch (material.type) {
    case 1:
      table_container.children('.board-summary').append(
        `
        <tr>
          <td>${element}</td>
          <td>${material.area}</td>
          <td>${material.sheets}</td>
          <td>${material.price}</td>
        </tr>
        `
      );
      break;
    case 2:
      table_container.children('.plank-summary').append(
        `
        <tr>
          <td>${element}</td>
          <td>${material.l}</td>
          <td>${material.price}</td>
        </tr>
        `
      );
      break;
    case 3:
      table_container.children('.dowel-summary').append(
        `
        <tr>
          <td>${element}</td>
          <td>${material.l}</td>
          <td>${material.price}</td>
        </tr>
        `
      );
      break;
  }
}

$.fn.render_summary = function () {
  "use strict";

  let container = $(this);

  let report = this.fetch_summary();

  let classes = Object.keys(report).filter(item => item !== 'price');

  console.log(report);

  $("#summary-heading").text(`Order Summary - $${report.price}`)

  for (var i=0; i<classes.length; i++) {

    let class_info = report[classes[i]];
    let class_pieces = class_info['materials'];

    container.append(
      `<div class="accordion" id="mainAccordion">
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-heading${i}">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapse${i}"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapse${i}"
          >
            ${classes[i]} Summary - $${class_info['price']}
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapse${i}"
          class="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-heading${i}"
        >
          <div class="${classes[i]}-container accordion-body">
            <table class="table table-sm table-striped table-hover">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Area</th>
                  <th>Sheets consumed</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody class="board-summary">
              </tbody>
            </table>
            <table class="table table-sm table-striped table-hover">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Length</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody class="plank-summary">
              </tbody>
            </table>
            <table class="table table-sm table-striped table-hover">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Length</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody class="dowel-summary">
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>`
    );

    Object.keys(class_pieces).forEach(element => {
      $(`.${classes[i]}-container table`).create_material_table(class_pieces, element);
    });
  }
};

$(document).ready(function () {
  $('.report-container').render_summary();
});