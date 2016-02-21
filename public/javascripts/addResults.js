$(document).ready(function() {
  console.log('From addResults');

  $('#categories').on('change', getNomineesByCategory);
  //$('#winner').on('change', getWinners);

  getInfo();
  getWinners();
});

function getInfo() {

  $.getJSON('/getDataForResults', function(response) {
    console.log(response);
    $('#categories').append('<option> --Select Item --</option>');
    $.each(response, function(i, item) {
      $('#categories').append('<option>' + item.Category + '</option>');
    });
  });

}

function getNomineesByCategory() {
  console.log($('#categories').val());
  var options = '';
  $('#winner option').remove();

  $.getJSON('/getDateByName/' + $('#categories').val(), function(response) {
    console.log(response);
    //options += '<option> --Select Item --</option>';
    $.each(response.Nominees, function(i, item) {
      //options += '<option> --Select Item --</option>';
      if (response.Category_Type == 'Actor')
        options += '<option>' + item.Actor + '</option>';
      else if (response.Category_Type == 'Movie')
        options += '<option>' + item.Movie + '</option>';
      else
        options += '<option>' + item.Director + '</option>';
    });
    $('#winner').append(options);
  });
}

function getWinners() {

  $.getJSON('/winnersinfo', function(response) {
    console.log(response);
    var tableContent = '';
    var amount;
    var voters;
    var winners;

    $.each(response, function(i, item) {
      if (item.amount != undefined)
        amount = item.amount;
      else
        amount = '0';

      if (item.voters != undefined)
        voters = item.voters
      else
        voters = '0';

      if (item.winners != undefined)
        winners = item.winners;
      else
        winners = '0';

      tableContent += '<tr>';
      tableContent += '<td>' + item.category + '</td>';
      tableContent += '<td>' + item.winner + '</td>';
      tableContent += '<td>$' + item.price + '</td>';
      tableContent += '<td>$' + amount + '</td>';
      tableContent += '<td>' + voters + '</td>';
      tableContent += '<td>' + winners + '</td>';
      tableContent += '</tr>';
    });

    $('#winners tbody').append(tableContent);

  });

}
