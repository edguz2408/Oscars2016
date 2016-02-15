var jsonfile;

$(document).ready(function() {
  // Initialize Smart Wizard with ajax content load
  //$('#wizard').smartWizard();
  console.log('Ready');
  loadChoices();

  $('.modal-content').show();
  setTimeout(function() {
    $('.modal-content').hide();
    populateInfo();
  }, 3000);


});
var obj = {};

function loadChoices() {

  //if(jsonfile == undefined){
  $.getJSON('/choicesdata', function(response) {


    console.log(response[0].selections[0].selection);
    jsonfile = response[0];


    console.log(jsonfile);

    $.each(response[0].selections, function(i, val) {
      obj[val.currentCategory] = val.selection;
    });

    console.log(obj);


  });
  return obj;

}

function populateInfo() {

  var selections = obj;
  //console.log();
  console.log('here');
  $('#wizard')
  .append('<h1 id="message" style="text-align:center;"> Vote is not available </h1>');
  $.getJSON('getData', function(response) {

    $('#message').hide();
    var lis = '';
    var divs = '';
    //var choices = '';
    console.log(selections);
    $('#message').hide();

    $('#wizard').append('<ul id="categories"></ul>');
    console.log(jsonfile);

    $.each(response, function(index, value) {
      console.log(value.Category);
      //console.log(value.Category);

      //lis
      lis += '<li><a href="#step-' + parseInt(index + 1) + '" style="width:350px;">'
      lis += '<label class="stepNumber">' + parseInt(index + 1) + '</label>';
      lis += '<span class="stepDesc">' + value.Category + '</br></span>';
      lis += '</a></li>';

      //Divs
      divs += '<div id="step-' + parseInt(index + 1) + '">';
      divs += '<h2 class="StepTitle"> ' + value.Category + ' </h2>';
      divs += '<div style="margin-bottom: 15px;"></div>';
      divs += '<div class="choices">';

      $.each(value.Nominees, function(i, val) {

        //if(jsonfile == undefined){

        if (value.Category_Type == 'Movie') {
          if (selections != undefined && selections[value.Category] == val.Movie) {
            divs += '<input type="radio" value="' + val.Movie + '" name="' + value.Category + '" checked/>' + val.Movie;
          } else {
            divs += '<input type="radio" value="' + val.Movie + '" name="' + value.Category + '" />' + val.Movie;
          }

        } else if (value.Category_Type == 'Director') {
          if (selections != undefined && selections[value.Category] == val.Director) {
            divs += '<input type="radio" value="' + val.Director + '" name="' + value.Category + '"  checked/>' + val.Director + ' &#x2012 ' + val.Movie;
          } else {
            divs += '<input type="radio" value="' + val.Director + '" name="' + value.Category + '"  />' + val.Director + ' &#x2012 ' + val.Movie;
          }

        } else if (value.Category_Type == 'Actor') {
          console.log(selections[value.Category]);
          if (selections != undefined && selections[value.Category] == val.Actor) {
            divs += '<input type="radio" value="' + val.Actor + '" name="' + value.Category + '"  checked/>' + val.Actor + ' &#x2012 ' + val.Movie;
          } else {
            divs += '<input type="radio" value="' + val.Actor + '" name="' + value.Category + '" />' + val.Actor + ' &#x2012 ' + val.Movie;
          }

        }

        divs += '</br>';

      });

      divs += '<input type="radio" value="NA" name="' + value.Category + '" /> N/A';
      divs += '</div>';
      divs += '</div>';
      divs += '</div>';

    });

    $('#categories').append(lis);
    $('#wizard').append(divs);
    $('#wizard').smartWizard({
      selected: 0,
      enableAllSteps: !$.isEmptyObject(selections),
      onLeaveStep: leaveAStepCallback,
      onFinish: onFinishCallback,
      labelFinish: 'Save'

    });


  });
}

function leaveAStepCallback(obj, context) {

  //  if (context.fromStep < context.toStep)
  return validateSteps(context.fromStep);
  //else return true;
}


function onFinishCallback(objs, context) {
  if (validateSteps(context.fromStep)) {

    $.ajax({
      type: "post",
      data: JSON.stringify(jsonfile),
      url: '/vote',
      contentType: 'application/json',
      dataType: "json" // response type
    }).done(function(response) {
      window.location.href = '/choices';
    });
  }

}


function validateSteps(stepNumber) {
  var isStepValid = true;
  console.log('from: ' + stepNumber);
  return runValidation(stepNumber);
}



function runValidation(stepNumber) {
  var choice = false;
  var item = stepNumber - 1;
  var currentCategory;
  var currentValue;
  //var jobject;
  $.each($('.choices').eq(item).children('input[type="radio"]'), function(i, val) {
    if ($(val).prop('checked')) {
      choice = true;
      setError(stepNumber, false);
      currentCategory = String($('.StepTitle').eq(item).text()).trim();
      currentValue = $(val).val();

      //      console.log(jsonfile);
      if (jsonfile == undefined) {
        //jsonfile.push({"user": "EdGuz", "selections": [{"currentCategory": currentCategory, "selection": currentValue}]});
        jsonfile = {
          //"user": "EdGuz",
          "selections": [{
            "currentCategory": currentCategory,
            "selection": currentValue
          }]
        };
        console.log(jsonfile.selections);
      } else if (jsonfile.selections[item] == undefined) {
        jsonfile.selections.push({
          "currentCategory": currentCategory,
          "selection": currentValue
        });
      } else {
        jsonfile.selections[item].currentCategory = currentCategory;
        jsonfile.selections[item].selection = currentValue;
      }
      return false
    } else {
      choice = false;
    }
  });
  if (choice == false)
    setError(stepNumber, true);
  console.log(JSON.stringify(jsonfile));
  return choice;

}

function setError(stepNumber, iserror) {
  console.log(stepNumber);

  $('#wizard').smartWizard('setError', {
    stepnum: stepNumber,
    iserror: iserror
  });

  if (iserror == true) {
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
