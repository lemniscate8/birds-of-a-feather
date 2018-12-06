
//TODO: Rename this file 'unhelpers' because it's become sooooo complicated


/**
 * nav - Code to set items to a default mode when changing tabs
 * (really just to stop simulating when in a different tab)
 *
 */
$('.nav-item').click(function() {
  $('.default-mode').click();
});


/**
 * only_one - Code to have single selection property in a list, used on
 * the species list
 *
 */
$('.only-one').click(function() {
  $(this).siblings().removeClass('active');
  $(this).addClass('active');
});



/**
 * pen - Sets the pen size when that field changes
 *
 */
$('#pen-size').change(function() {
  penWidth = parseInt($(this).val());
});


/**
 * pen - Sets the pen density when that field changes
 *
 */
$('#pen-density').change(function() {
  spacing = parseInt($(this).val());
});


/**
 * anonymous function - Loads data into the species editor modal when it appears
 *
 */
$('#speciesEditModal').on('show.bs.modal', function (e) {
  var nameList = ['size', 'range', 'maxSpeed', 'wanderDev', 'color', 'name'];
  for(var item of nameList) {
    $('#active-' + item).val(activeSpecies[item]);
  }
  $('#active-fixed').checked = activeSpecies.fixed;
})


/**
 * input - Saves numeric data into the active species when it is edited in
 *  the modal
 *
 */
$('#speciesEditForm').find("input[type='number']").change(function() {
  var value = parseFloat($(this).val());
  if(!isNaN(value)) {
    activeSpecies[$(this).attr('name')] = value;
  }
});


/**
 * input - Saves text data into the active species when it is edited in
 *  the modal
 *
 */
$('#speciesEditForm').find("input[type='text']").change(function() {
  var value = $(this).val();
  if(value) {
    var name = $(this).attr('name');
    activeSpecies[name] = value;
    if(name == 'name') {
      $(activeSpecies.html).find(':first-child').html(value);
    }
  }
});


/**
 * input - Saves check box data into the active species when it is edited in
 *  the modal
 *
 */
$('#speciesEditForm').find("input[type='checkbox']").change(function() {
  activeSpecies[$(this).attr('name')] = $(this).prop('checked');
});



/**
 * speciesHTML - speciesHTML - Creates the DOM element for the species to be displayed on the
 * index page
 *
 * @param  {string} nameText The name of the species
 */
speciesHTML = function(nameText) {
  var listItem = document.createElement('li');
  listItem.setAttribute('class','list-group-item only-one-light');
  var name = document.createElement('span');
  name.innerHTML = nameText;
  listItem.append(name);
  var editSpan = document.createElement('span');
  editSpan.setAttribute('class','close speciesDelete');
  editSpan.setAttribute('data-toggle','modal');
  editSpan.setAttribute('data-target','#speciesEditModal');
  editSpan.setAttribute('onclick', '$(".default-mode").click();')
  editSpan.innerHTML = '&#9998;';
  var closeSpan = document.createElement('span');
  closeSpan.setAttribute('class','close speciesDelete ml-2');
  closeSpan.innerHTML = '&times';
  $(closeSpan).click(function() {
    var li = $(this).parent();
    if(li.hasClass('list-group-item-primary'));
      activeSpecies = null;
    engine.remove(species[li.index()]);
    species.splice(li.index(), 1);
    li.remove();
  });
  listItem.append(closeSpan);
  listItem.append(editSpan);
  $(listItem).click(function() {
    $(this).siblings('li').removeClass('list-group-item-primary');
    $(this).addClass('list-group-item-primary');
    activeSpecies = species[$(this).index()];
  });
  $(listItem).insertBefore('#speciesAdder');
  return listItem;
}


/**
 * genTable - Function to generate the interaction table for species whenever
 * that tab is opened
 *
 */
genTable = function() {
  var base = document.getElementById('interMatrix');
  var table = document.createElement('table');
  table.setAttribute('class','table table-bordered');
  var thead = document.createElement('thead');
  var tableRow = document.createElement('tr');
  tableRow.innerHTML = '<th scope="col">[X] responds to [Y]</th>\n';
  for(var i = 0; i < species.length; i++) {
    tableRow.innerHTML += '<th scope="col">' + species[i].name + '</th>\n';
  }
  thead.append(tableRow);
  table.append(thead);
  var tbody = document.createElement('tbody');
  for(var i = 0; i < species.length; i++) {
    tableRow = document.createElement('tr');
    tableRow.innerHTML = '<th scope="row">' + species[i].name + '</th>\n';
    for(var j = 0; j < species.length; j++) {
      tableData = document.createElement('td');
      var add = document.createElement('span');
      add.setAttribute('class','close');
      add.setAttribute('data-species1', species[i].id);
      add.setAttribute('data-species2', species[j].id);
      add.innerHTML = '+';
      $(add).click(addOrDisplayBehavior(add, species[i], species[j]));
      tableData.append(add);
      tableRow.append(tableData);
      //If a behavior exists, display it
      if(species[i].inter[species[j]])
        add.click();
    }
    tbody.append(tableRow)
  }
  table.append(tbody);
  base.innerHTML = '';
  base.append(table);
}


/**
 * addOrDisplayBehavior - a closure to provide create a behavior edit form
 * when "+" is clicked
 *
 * @param  {HTMLElement} element  A reference to the element the behavior form wil be in
 * @param  {Species} species1 The column species
 * @param  {Species} species2 The row species
 * @return {function}          A closure
 */
var testVar;
addOrDisplayBehavior = function(element, species1, species2) {
  return function() {
    var button = $(this);
    var outer = button.parent();
    if(species1.inter[species2] == undefined) {
      species1.inter[species2] = new Behavior(Math.round(5*Math.random()+1),
                                              Math.round(5*Math.random()+1),
                                              Math.round(5*Math.random()+1),
                                              Math.round(5*Math.random()+1));
    }
    outer.append(behaviorWigget(species1, species2, species1.inter[species2]));
    outer.find('input').change(function() {
      alterInteraction(species1, species2).call(this);
    });
    button.html('&times');
    button.click(function() {
      delete species1.inter[species2];
      outer.empty();
      outer.append(button);
      button.html('+');
      button.click(addOrDisplayBehavior(button, species1, species2));
    });
  };
}


/**
 * alterInteraction - A function to create a closure that exits the behavior
 * of some species... frankly this is in deep
 *
 * @param  {Species} species1 First species
 * @param  {Species} species2 Second species
 * @return {Function}          A closure
 */
alterInteraction = function(species1, species2) {
  return function() {
    var source = $(this);
    species1.inter[species2][source.data('target')] = parseInt(source.val());
  };
}


/**
 * behaviorWigget - Generates a form for a specific behavior interaction
 * between two species
 *
 * @param  {Species} species1 First species
 * @param  {Species} species2 Second species
 * @param  {Behavior} behavior A behavior object
 * @return {HTMLElement}          A widget with sliders to edit species
 */
behaviorWigget = function(species1, species2, behavior) {
  var wigget = document.createElement('form');
  wigget.setAttribute('class', 'form-horizontal p-2');
  var uid = species1 + species2;
  //wigget.innerHTML
  var htmlString = '';
  htmlString +=
  `<label for='${uid + 'stick'}' class='col-form-label col-form-label-sm'>
  Cohesion:</label>\n <input type='range' class='form-control-range'
   min='0' max='10' id='${uid + 'stick'}' data-target='stick', step='1'
   value='${behavior.stick}'>`;

  htmlString +=
  `<label for='${uid + 'avoid'}' class='col-form-label col-form-label-sm'>
  Avoidance:</label>\n <input type='range' class='form-control-range'
   min='0' max='10' id='${uid + 'avoid'}' data-target='avoid', step='1'
   value='${behavior.avoid}'>`;

  htmlString +=
  `<label for='${uid + 'align'}' class='col-form-label col-form-label-sm'>
  Alignment:</label>\n <input type='range' class='form-control-range'
   min='0' max='10' id='${uid + 'align'}' data-target='align', step='1'
   value='${behavior.align}'>`;

  htmlString +=
  `<label for='${uid + 'wandr'}' class='col-form-label col-form-label-sm'>
  Wandering:</label>\n <input type='range' class='form-control-range'
   min='0' max='10' id='${uid + 'wandr'}' data-target='wandr', step='1'
   value='${behavior.wandr}'>`;

  return htmlString;
}
