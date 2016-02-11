$(document).ready(function(){
  console.log('From addResults');
  $('#categories').on('change', getNomineesByCategory);
  getInfo();
});

function getInfo(){

  $.getJSON('/getData', function(response){
    console.log(response);
     $('#categories').append('<option> --Select Item --</option>');
    $.each(response, function(i, item){
      $('#categories').append('<option>' + item.Category + '</option>');
    });
  });

}

function getNomineesByCategory(){
  console.log($('#categories').val());
  var options = '';
  $('#winner option').remove();
  $.getJSON('/getDateByName/' + $('#categories').val(), function(response){
    console.log(response);
    $.each(response.Nominees, function(i, item){
	//options += '<option> --Select Item --</option>';
      if(response.Category_Type == 'Actor')
        options += '<option>' + item.Actor + '</option>';
      else if(response.Category_Type == 'Movie')
        options += '<option>' + item.Movie + '</option>';
      else
        options += '<option>' + item.Director + '</option>';
    });
    $('#winner').append(options);
  });
}
