$(document).ready(function() {
   // Initialize Smart Wizard with ajax content load
    //$('#wizard').smartWizard();
   console.log('Ready');
   populateInfo();


});

function populateInfo() {
  $.getJSON('getData', function(response) {

    var lis = '';
    var divs = '';
    //var choices = '';
    console.log(response[0]);

    $('#wizard').append('<ul id="categories"></ul>');

    $.each(response[0].oscars2016, function(index, value) {
      console.log(value.Category);
      //console.log(value.Category);

      //lis
      lis += '<li><a href="#step-' + parseInt(index + 1) + '" style="width:350px;">'
      lis += '<label class="stepNumber">'+parseInt(index + 1)+'</label>';
      lis += '<span class="stepDesc">'+ value.Category + '</br></span>';
      lis += '</a></li>';

      //Divs
      divs += '<div id="step-'+ parseInt(index + 1) +'">';
      divs += '<h2 class="StepTitle"> ' + value.Category + ' </h2>';
      divs += '<div style="margin-bottom: 15px;"></div>';
      divs += '<div class="choices">';

      $.each(value.Nominees, function(i, val) {

        if(value.Category_Type == 'Movie'){
          divs += '<input type="radio" value="' +val.Movie +'" name="'+value.Category_Type+'"  />' +val.Movie;
        } else if (value.Category_Type == 'Director'){
          divs += '<input type="radio" value="' +val.Director +'" name="'+value.Category_Type+'"  />' + val.Director + ' &#x2012 ' +val.Movie;
        } else{
          divs += '<input type="radio" value="' + val.Actor +'" name="'+ value.Category_Type +'"  />' + val.Actor + ' &#x2012 ' +val.Movie;
        }

        divs += '</br>';

      });
      divs += '<input type="radio" value="NA" name="'+value.Category_Type+'" /> N/A';
      divs += '</div>';
      divs += '</div>';
      divs += '</div>';

    });
    $('#categories').append(lis);
    $('#wizard').append(divs);

    $('#wizard').smartWizard( {
      onLeaveStep:leaveAStepCallback,
      onFinish:onFinishCallback

    });


  });
}

function leaveAStepCallback(obj, context){
  //alert("Leaving step" + context.fromStep + " to go to step " + context.toStep);
  console.log(obj);
  console.log(context);
  if(context.fromStep < context.toStep)
    return validateSteps(context.fromStep);
  else return true;
}

function onFinishCallback(objs, context){
    alert('Thanks for participating')
}

function validateSteps(stepNumber) {
  var isStepValid = true;
  console.log('from: ' + stepNumber);
  return runValidation(stepNumber);
}

function runValidation(stepNumber) {
  var choice = false;
  var item = stepNumber - 1;
  console.log(item);

  $.each($('.choices').eq(item).children('input[type="radio"]'), function(i, val) {
    if($(val).prop('checked')){
      console.log('can pass!');
      choice = true;
      setError(stepNumber, false);
      return false
    } else {
      choice = false;

    }
  });

  if(choice == false)
    setError(stepNumber, true);


  return choice;
}

function setError(stepNumber, iserror){
  console.log(stepNumber);

  $('#wizard').smartWizard('setError',
    {
      stepnum:stepNumber,
    iserror:iserror
 });

  if(iserror == true){
    console.log('Is Error:: ' + iserror);
    alert('Yo man you gotta make a choice');
  }


  return false;
}

/*<li><a href="#step-1">
      <label class="stepNumber">1</label>
      <span class="stepDesc">
         Step 1<br />
         <small>Step 1 description</small>
      </span>
  </a></li>

  <div id="step-1">
      <h2 class="StepTitle">Step 1 Content</h2>
       step content
  </div>

  */
