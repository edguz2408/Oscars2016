$(document).ready(function() {
  console.log('From results');
  getWinners();
  updateAmount();
});

function getWinners() {

  $.getJSON('/winnersinfo', function(response) {
    console.log(response);
    var tableContent = '';

    $.each(response, function(i, item) {
      tableContent += '<tr>';
      tableContent += '<td>' + item.category + '</td>';
      tableContent += '<td>' + item.winner + '</td>';
      tableContent += '<td>' + item.price + '</td>';
      tableContent += '<td>' + item.amount + '</td>';
      tableContent += '<td>' + item.voters + '</td>';
      tableContent += '</tr>';
    });

    $('#winners tbody').append(tableContent);

  });

}



function updateAmount() {


  var voters;
  var winners = {};
  var amounts = {};

  $.getJSON('/winnersinfo', function(response) {
    $.each(response, function(i, item) {
      winners[item.category] = item.winner;
    });
    console.log(winners);
    $.getJSON('/allchoices', function(response) {

      $.each(response, function(i, item) {
        $.each(item.selections, function(index, it) {
          if (winners[it.currentCategory] == it.selection) {
            if (amounts[it.currentCategory] == undefined) {
              amounts[it.currentCategory] = 1;
            } else {
              amounts[it.currentCategory] += 1;
            }
          }
          console.log(amounts);
        });

      });

      $.map(amounts, function(n, i) {
        $.ajax({
          type : 'PUT',
          url :'/updateamount/' + i + ',' + (n*100) + ',' + n
        }).done(function(response){
          console.log(response);
        });
      });
    });
  });
 showWinners();
}

function showWinners(){
  $.getJSON('/winnersinfo', function(response) {
    var tableContent = '';
    var SummaryTable = '';
    var result = response;
    var currentCategory;
    var currentUser;
    var total;
    var summary = {};
    
    console.log(result);	
    
    $.getJSON('/allchoices', function(choices){
	    console.log(choices);
      $.each(result, function(index, value) {
        $.each(choices, function(i, item){
          $.each(item.selections, function(x, val) {
            
              if(value.winner ==  val.selection){
                if(value.category != currentCategory && item.user != currentUser){
                  console.log(item.user + ' won!');
                  console.log(value.category);
                  //tableContent += '<div><h4>' + value.category + '</h2></div>';
                  tableContent += '<div style="float:left; margin-left:15px;">';
                  tableContent += '<h4>' + value.category + '</h4>';
                  tableContent += '<table class="table table-hover table-bordered">';
                  tableContent += '<tr>';
                  tableContent += '<th> User </th>';
                  tableContent += '<th> Total </th>';
                  tableContent += '</tr>';
                  tableContent += '<tr>';				
                  tableContent += '<td>' + item.user + '</td>';
                  tableContent += '<td>$' + parseInt(value.amount / value.voters) + '</td>';
                  tableContent += '</tr>';    
                  
                  total = parseInt(value.amount / value.voters);
                  summary[item.user] = total;
                  
                  /*SummaryTable += '<div style="float:left; margin-left:15px;">';
                  SummaryTable += '<h4>Summary</h4>';
                  SummaryTable += '<table class="table table-hover table-bordered">';
                  SummaryTable += '<tr>';
                  SummaryTable += '<th>User</th>';
                  SummaryTable += '<th>Total Won</th>';
                  SummaryTable += '</tr>';
                  SummaryTable += '<tr>';
                  SummaryTable += '<td>' + item.user + '</td>';
                  SummaryTable += '<td>' + total + '</td>';*/
                  
                  currentCategory = value.category;
                  currentUser = item.user;
                  
                } else {
                  
                  tableContent += '<tr>';				
                  tableContent += '<td>' + item.user + '</td>';
                  tableContent += '<td>$' + parseInt(value.amount / value.voters) + '</td>';
                  tableContent += '</tr>';                       
                  total += parseInt(value.amount / value.voters);
                  summary[item.user] = total;
                  
                  /*tableContent += SummaryTable;
                  total += parseInt(value.amount / value.voters);
                  tableContent += '<tr>';
                  tableContent += '<td>' + item.user + '</td>';
                  tableContent += '<td>' + total + '</td>';
                  tableContent += '</tr>';
                
                  tableContent += '</table></div>';*/
                  
                }
                 
  
            }  
            
            
          });
            
           
          });
          
          
        //SummaryTable += '</table></div>';
        tableContent += '</table></div></div>';
        console.log(SummaryTable);
        console.log(tableContent);
      
      });
      
      
      $('#container').append(tableContent);
      console.log(summary);
      
      SummaryTable += '<div>';
      SummaryTable += '<table class="table">';
      SummaryTable += '<tr>';
      SummaryTable += '<th> User </th>';
      SummaryTable += '<th> Total Won </th>';
      SummaryTable += '</tr>';
      
      $.map(summary, function(n, i) {      
        SummaryTable += '<tr>';
        SummaryTable += '<td>' + i + '</td>';
        SummaryTable += '<td>' + n + '</td>';
        SummaryTable += '</tr>';      
      });
      
      SummaryTable += '</table>';
      SummaryTable += '<div>';
       
      $('#summary').append(SummaryTable);
      
     
   });
  
   /*$.map(summary, function(n, i) {
     SummaryTable += '<div>';
     SummaryTable += '<table class="table">';
     SummaryTable += '<tr>';
     SummaryTable += '<th> User </th>';
     SummaryTable += '<th> Total Won </th>';
     SummaryTable += '</tr>';
     SummaryTable += '<tr>';
     SummaryTable += '<td>' + i + '</td>';
     SummaryTable += '<td>' + n + '</td>';
     SummaryTable += '</tr>';
     SummaryTable += '</table>';
     SummaryTable += '<div>';
   });
    
   $('#summary').append(SummaryTable);*/
  
    
 });
}


