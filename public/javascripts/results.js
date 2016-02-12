$(document).ready(function() {
  console.log('From results');
  //getWinners();
  updateAmount();
});

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



function updateAmount() {

  var voters = {};
  var winners = {};
  var amounts = {};
  var winnersAmount = {};

  $.getJSON('/winnersinfo', function(response) {
    $.each(response, function(i, item) {
      voters[item.category] = item.category;
      winners[item.category] = item.winner;
    });
    console.log(winners);
    $.getJSON('/allchoices', function(response) {

      $.each(response, function(i, item) {
        $.each(item.selections, function(index, it) {
          if (voters[it.currentCategory] == it.currentCategory) {
            if (amounts[it.currentCategory] == undefined) {
              amounts[it.currentCategory] = 1;
            } else {
              amounts[it.currentCategory] += 1;
            }
          }

          if (winners[it.currentCategory] == it.selection) {
            if (winnersAmount[it.currentCategory] == undefined) {
              winnersAmount[it.currentCategory] = 1;
            } else {
              winnersAmount[it.currentCategory] += 1;
            }
          }

          console.log(amounts);
        });

      });

      $.map(amounts, function(n, i) {
        $.ajax({
          type: 'PUT',
          url: '/updateamount/' + i + ',' + (n * 100) + ',' + n + ',' + winnersAmount[i]
        }).done(function(response) {
          console.log(response);
        });
      });
    });
  });

  setTimeout(function() {
    getWinners();
    showWinners();
    $('.modal-content').hide();
  }, 3000);

}

function showWinners() {
  $.getJSON('/winnersinfo', function(response) {
    var tableContent = '';
    var SummaryTable = '';
    var result = response;
    var currentCategory;
    var currentUser;
    var total;
    var summary = {};

    console.log(result);

    $.getJSON('/allchoices', function(choices) {
      console.log(choices);
      $.each(result, function(index, value) {
        $.each(choices, function(i, item) {
          $.each(item.selections, function(x, val) {

            if (value.winner == val.selection) {
              currentUser = item.user;
              console.log(item.user + ' won!');
              console.log(value.category);
              if (value.category != currentCategory) {

                //tableContent += '<div style="float:left; margin-left:15px;">';
                tableContent += '<div>';
                tableContent += '<h5>' + value.category + '</h5>';
                tableContent += '<table class="table table-hover table-bordered">';
                tableContent += '<tr>';
                tableContent += '<th> User </th>';
                tableContent += '<th> Total </th>';
                tableContent += '</tr>';
                tableContent += '<tr>';
                tableContent += '<td style="width:200px">' + item.user + '</td>';
                tableContent += '<td style="width:200px">$' + parseInt(value.amount / value.winners) + '</td>';
                tableContent += '</tr>';

                total = parseInt(value.amount / value.winners);
                currentCategory = value.category;

                console.log(item.user);
                //summary[item.user] = parseInt(value.amount / value.winners);
              } else {
                console.log(item.user + ' won!');
                console.log(value.category);

                tableContent += '<tr>';
                tableContent += '<td>' + item.user + '</td>';
                tableContent += '<td>$' + parseInt(value.amount / value.winners) + '</td>';
                tableContent += '</tr>';


              }

              if (summary[item.user] == undefined) {
                summary[item.user] = parseInt(value.amount / value.winners);
              } else {
                summary[item.user] += parseInt(value.amount / value.winners);
              }
            }
          });

        });

        tableContent += '</table></div></div>';
        console.log(SummaryTable);
        console.log(tableContent);

      });


      $('#container').append(tableContent);
      console.log(summary);
      SummaryTable += '<div>';
      SummaryTable += '<h3> Summary </h3>';
      SummaryTable += '<hr/>';
      SummaryTable += '<table class="table table-hover table-bordered">';
      SummaryTable += '<tr>';
      SummaryTable += '<th> User </th>';
      SummaryTable += '<th> Total Earned </th>';
      SummaryTable += '</tr>';

      $.map(summary, function(n, i) {
        SummaryTable += '<tr>';
        SummaryTable += '<td style="width:200px">' + i + '</td>';
        SummaryTable += '<td style="width:200px">$' + n + '</td>';
        SummaryTable += '</tr>';
      });

      SummaryTable += '</table>';
      SummaryTable += '<div>';

      $('#summary').append(SummaryTable);


    });


  });
}
