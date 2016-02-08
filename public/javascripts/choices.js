$(document).ready(function() {
  getChoices();
});

function getChoices(){

  $.getJSON('/choicesdata', function(response){
    var tableContent = '';
    
    $.each(response[0].selections, function(i, val ){
      tableContent += '<tr>';
      tableContent += '<td>' + val.currentCategory + '</td>';
      tableContent += '<td>' + val.selection + '</td>';
      tableContent += '</tr>';
    });

    $('#results tbody').html(tableContent);
  });

}
