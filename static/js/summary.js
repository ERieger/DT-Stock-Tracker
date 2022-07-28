/* Fetch the summary report from the server */
$.fn.fetch_summary = function () {
  "use strict";

  let project = $.ajax({  //sending a POST request to retrieve the JSON object
    async: false,
    method: "POST",
    url: "/projects/report",
    success: function (data) {
      return JSON.stringify(data);
    }
  });

  return project.responseJSON; //return the JSON in the POST return object
};

/* Append a table row for each material entry */
$.fn.create_material_table = function (class_pieces, element) {
  "use strict";

  let table_container = $(this);  //The container for all tables

  let material = class_pieces[element]; //The material to be appended

  switch (material.type) {  //Append to a different subtable based on type
    case 1:
      table_container.children('.board-summary').append(
        `
        <tr>
          <td>${element}</td>
          <td>${material.area}mm²</td>
          <td>${material.sheets}</td>
          <td>$${material.price}</td>
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
          <td>$${material.price}</td>
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
          <td>$${material.price}</td>
        </tr>
        `
      );
      break;
  }
}

/* Create the summary page */
$.fn.render_summary = function () {
  "use strict";

  let container = $(this);  //container for new accordians

  let report = this.fetch_summary();  //Fetch the summary object

  let classes = Object.keys(report).filter(item => item !== 'price'); //Extract class names from the report

  $("#summary-heading").text(`Order Summary - $${report.price}`)  //Update the total price in the report heading

  for (var i=0; i<classes.length; i++) {  //for each of the classes

    let class_info = report[classes[i]];
    let class_pieces = class_info['materials']; //each material entry in the class report

    //Create a new accordian for the class
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
            <h3>Boards</h3>
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
            <h3>Planks</h3>
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
            <h3>Dowels</h3>
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

    //For each of the material entries
    Object.keys(class_pieces).forEach(element => {
      $(`.${classes[i]}-container table`).create_material_table(class_pieces, element); //Add a new row to the material's table
    });
  }
};

/* When the page is loaded, generate the report */
$(document).ready(function () {
  $('.report-container').render_summary();
});