
//Switching pages causes simualtion defaults to be reset
//(right now just stops the simulation)
$('.nav-item').click(function() {
  $('.default-mode').click();
});

$('.only-one').click(function() {
  $(this).siblings().removeClass('active');
  $(this).addClass('active');
});

speciesHTML = function(nameText) {
  var listItem = document.createElement('li');
  listItem.setAttribute('class','list-group-item only-one-light');
  var name = document.createTextNode(nameText);
  listItem.append(name);
  var closeSpan = document.createElement('span');
  closeSpan.setAttribute('class','align-right close');
  closeSpan.innerHTML = '&times';
  $(closeSpan).click(function() {
    var li = $(this).parent();
    if(li.hasClass('list-group-item-primary'));
      activeSpecies = null;
    species.splice(li.index(), 1);
    li.remove();
  });
  listItem.append(closeSpan);
  $(listItem).click(function() {
    $(this).siblings('li').removeClass('list-group-item-primary');
    $(this).addClass('list-group-item-primary');
    activeSpecies = species[$(this).index()];
  });
  $(listItem).insertBefore('#speciesAdder');
  return listItem;
}

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
      //If a behavior exists display it
      if(species[i].inter[species[j]])
        add.click();
    }
    tbody.append(tableRow)
  }
  table.append(tbody);
  base.innerHTML = '';
  base.append(table);
}

addOrDisplayBehavior = function(element, species1, species2) {
  return function() {
    var button = $(element);
    var outer = button.parent();
    outer.append(behaviorWigget(species1, species2,
      species1.inter[species2]));
    button.html('&times');
    outer.select()
    button.click(function() {
      delete species1.inter[species2];
      outer.empty();
      outer.append(button);
      button.html('+');
      button.click(addOrDisplayBehavior(button, species1, species2));
    });
    console.log(outer.find('input'));
    outer.find('input').change(function() {
      alterInteraction(species1, species2).call(this);
    });
  };
}

alterInteraction = function(species1, species2) {
  return function() {
    var source = $(this);
    console.log(source.data('target') + ' ' + source.val());
  };
}

behaviorWigget = function(species1, species2, behavior) {
  var wigget = document.createElement('form');
  wigget.setAttribute('class', 'form-range p-2');
  var uid = species1 + species2;
  //wigget.innerHTML
  var htmlString = '';
  htmlString +=
  `<label for='${uid + 'stick'}' class='col-form-label col-form-label-sm'>
  Cohesion:</label>\n <input type='range' class='form-control-range'
   min='0' max='10' id='${uid + 'stick'}' data-target='stick', step='1'` +
  (behavior ? `value='${behavior.stick}'` : `value='5'`) + `>`;


  return htmlString;
}
