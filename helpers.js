
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
      var behavior = species[i].inter[species[j]];
      if(behavior) {
        tableData.innerHTML = "Behavior Found";
      } else {
        var add = document.createElement('span');
        add.setAttribute('class','close addInterWidget');
        add.setAttribute('data-species1', species[i].id);
        add.setAttribute('data-species2', species[j].id);
        add.innerHTML = '+';
        tableData.append(add);
      }
      tableRow.append(tableData);
    }
    tbody.append(tableRow)
  }
  table.append(tbody);
  base.innerHTML = '';
  base.append(table);
  $('.addInterWidget').click(function() {
    $(this).parent().innerHTML = behaviorWigget().html;
    //console.log([$(this).parent().index() - 1, $(this).parent().parent().index()]);
  })
}



behaviorWigget = function(element, behavior, x, y) {
  var wigget = document.createElement('form');
  wigget.setAttribute('class', 'form-range');
  var slide1 = document.createElement('input');
  slide1.setAttribute('type', 'range');
  slide1.setAttribute('')
}

regenerateMatrix = function() {
  var base = document.getElementById('interMatrix');
  base.innerHTML = '';
  for(var i = 0; i < species.length; i++) {
    var row = document.createElement('div');
    row.setAttribute('class','row');
    for(var j = 0; j < species.length; j++) {
      var col = document.createElement('div');
      col.setAttribute('class','col card');
      var card = document.createElement('div');
      card.setAttribute('class','card-body text-center');
      var add = document.createElement('span');
      add.setAttribute('class','close');
      $(add).click(function() {
        $(this).parent();
      });
      add.innerHTML = '+';
      card.append(add)
      col.append(card);
      row.append(col);
    }
    base.append(row);
  }
}
