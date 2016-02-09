$(document).ready(function() {
  getChoices();
});

function getChoices(){

  $.getJSON('/choicesdata', function(response){
    var tableContent = '';
    if(response[0] != undefined){
      $.each(response[0].selections, function(i, val ){
        tableContent += '<tr>';
        tableContent += '<td>' + val.currentCategory + '</td>';
        tableContent += '<td>' + val.selection + '</td>';
        tableContent += '</tr>';
      });
    } else {
      $('body').append('<h1 style="text-align:center;"> Yo man you haven\'t made any choices yet </h1>');
    }


    $('#results tbody').html(tableContent);
  });

}
