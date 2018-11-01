
//Switching pages causes simualtion defaults to be reset
//(right now just stops the simulation)
$('.nav-item').click(function() {
  $('.default-mode').click();
});

$('.only-one').click(function() {
  $(this).siblings().removeClass('active');
  $(this).addClass('active');
});

$('li.only-one-light').click(function() {
  $(this).siblings('li').removeClass('list-group-item-primary');
  $(this).addClass('list-group-item-primary');
});

regenerateMatrix = function() {
  var base = $('#interMatrix')[0];
  console.log(base);
}
