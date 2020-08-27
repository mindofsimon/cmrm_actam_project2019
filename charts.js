var total_scores=[];
var already_read_record=false;

//active user
var name;
let params = new URLSearchParams(location.search);
name=params.get('name');
username_label.innerText="@"+name;

//FIREBASE CONFIG
var firebaseConfig = {
  apiKey: "AIzaSyAXlQJ2hc2C8r6OFI7iJO6ThmyT1vsLUqQ",
  authDomain: "actam-cmrm-project.firebaseapp.com",
  databaseURL: "https://actam-cmrm-project.firebaseio.com",
  projectId: "actam-cmrm-project",
  storageBucket: "actam-cmrm-project.appspot.com",
  messagingSenderId: "853931045133",
  appId: "1:853931045133:web:666902c0b358a52fbc8044"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore()

//pie chart canvas variables
var canvas=document.getElementById('pie');
var ctx = canvas.getContext('2d');
var alreadyRead=false;

function buildPie(record){
  var drawPieChart = function(data, colors) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);//clearing the context to redraw another pie
    canvas = document.getElementById('pie');
    ctx = canvas.getContext('2d');
    var x = canvas.width / 2;
        y = canvas.height / 2;
    var color,
        startAngle,
        endAngle,
        total = getTotal(data);
          
    for(var i=0; i<data.length; i++) {
      color = colors[i];
      startAngle = calculateStart(data, i, total);
      endAngle = calculateEnd(data, i, total);
            
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(x, y);
      ctx.arc(x, y, y-100, startAngle, endAngle);
      ctx.fill();
      ctx.rect(canvas.width - 200, y - i * 30, 12, 12);
      ctx.fill();
      ctx.font = "13px sans-serif";
      ctx.fillText(data[i].label + " - " + data[i].value + " (" + calculatePercent(data[i].value, total) + "%)", canvas.width - 200 + 20, y - i * 30 + 10);
    }
  };
        
  var calculatePercent = function(value, total) {
    return (value / total * 100).toFixed(2);
  };
        
  var getTotal = function(data) {
    var sum = 0;
    for(var i=0; i<data.length; i++) {
      sum += data[i].value;
    }
    return sum;
  };
        
  var calculateStart = function(data, index, total) {
    if(index === 0) {
      return 0;
    }
    return calculateEnd(data, index-1, total);
  };
        
  var calculateEndAngle = function(data, index, total) {
    var angle = data[index].value / total * 360;
    var inc = ( index === 0 ) ? 0 : calculateEndAngle(data, index-1, total);
      return ( angle + inc );
  };
  var calculateEnd = function(data, index, total) {
    return degreeToRadians(calculateEndAngle(data, index, total));
  };
        
  var degreeToRadians = function(angle) {
    return angle * Math.PI / 180
  }
      
  function howMany(ar,n,d,inp,lev){//HANDLE CHECKBOXES
    cont=0;
    for(i=0;i<ar.length;i++){
      if(!mine.checked && level_check.checked && diff_check.checked && input_check.checked){
        if(ar[i].level==lev && ar[i].score==n && ar[i].difficulty==d && ar[i].input==inp){//checking user parameters
          cont++
        }
      }
      else if(!mine.checked && level_check.checked && diff_check.checked && !input_check.checked){
        if(ar[i].level==lev && ar[i].score==n && ar[i].difficulty==d){//checking user parameters
          cont++
        }
      }
      else if(!mine.checked && level_check.checked && !diff_check.checked && input_check.checked){
        if(ar[i].level==lev && ar[i].score==n && ar[i].input==inp){//checking user parameters
          cont++;
        }
      }
      else if(!mine.checked && level_check.checked && !diff_check.checked && !input_check.checked){
        if(ar[i].level==lev && ar[i].score==n){//checking user parameters
          cont++
        }
      }
      else if(!mine.checked && !level_check.checked && diff_check.checked && input_check.checked){
        if(ar[i].score==n && ar[i].difficulty==d && ar[i].input==inp){//checking user parameters
          cont++
        }
      }
      else if(!mine.checked && !level_check.checked && diff_check.checked && !input_check.checked){
        if(ar[i].score==n && ar[i].difficulty==d){//checking user parameters
          cont++
        }
      }
      else if(!mine.checked && !level_check.checked && !diff_check.checked && input_check.checked){
        if(ar[i].score==n && ar[i].input==inp){//checking user parameters
          cont++
        }
      }
      else if(!mine.checked && !level_check.checked && !diff_check.checked && !input_check.checked){
        if(ar[i].score==n){//checking user parameters
          cont++
        }
      }
      else if(mine.checked && level_check.checked && diff_check.checked && input_check.checked){
        if(ar[i].name==name && ar[i].level==lev && ar[i].score==n && ar[i].difficulty==d && ar[i].input==inp){//checking user parameters
          cont++
        }
      }
      else if(mine.checked && level_check.checked && diff_check.checked && !input_check.checked){
        if(ar[i].name==name && ar[i].level==lev && ar[i].score==n && ar[i].difficulty==d){//checking user parameters
          cont++
        }
      }
      else if(mine.checked && level_check.checked && !diff_check.checked && input_check.checked){
        if(ar[i].name==name && ar[i].level==lev && ar[i].score==n && ar[i].input==inp){//checking user parameters
          cont++;
        }
      }
      else if(mine.checked && level_check.checked && !diff_check.checked && !input_check.checked){
        if(ar[i].name==name && ar[i].level==lev && ar[i].score==n){//checking user parameters
          cont++
        }
      }
      else if(mine.checked && !level_check.checked && diff_check.checked && input_check.checked){
        if(ar[i].name==name && ar[i].score==n && ar[i].difficulty==d && ar[i].input==inp){//checking user parameters
          cont++
        }
      }
      else if(mine.checked && !level_check.checked && diff_check.checked && !input_check.checked){
        if(ar[i].name==name && ar[i].score==n && ar[i].difficulty==d){//checking user parameters
          cont++
        }
      }
      else if(mine.checked && !level_check.checked && !diff_check.checked && input_check.checked){
        if(ar[i].name==name && ar[i].score==n && ar[i].input==inp){//checking user parameters
          cont++
        }
      }
      else if(mine.checked && !level_check.checked && !diff_check.checked && !input_check.checked){
        if(ar[i].name==name && ar[i].score==n){//checking user parameters
          cont++
        }
      }
    }
    return cont;
  }
      
  var data = [
    { label: '0/10', value: howMany(record,0,difficulty.value,input.value,level.value) },
    { label: '1/10', value: howMany(record,1,difficulty.value,input.value,level.value) },
    { label: '2/10', value: howMany(record,2,difficulty.value,input.value,level.value) },
    { label: '3/10', value: howMany(record,3,difficulty.value,input.value,level.value) },
    { label: '4/10', value: howMany(record,4,difficulty.value,input.value,level.value) },
    { label: '5/10', value: howMany(record,5,difficulty.value,input.value,level.value) },
    { label: '6/10', value: howMany(record,6,difficulty.value,input.value,level.value) },
    { label: '7/10', value: howMany(record,7,difficulty.value,input.value,level.value) },
    { label: '8/10', value: howMany(record,8,difficulty.value,input.value,level.value) },
    { label: '9/10', value: howMany(record,9,difficulty.value,input.value,level.value) },
    { label: '10/10', value: howMany(record,10,difficulty.value,input.value,level.value) }
  ];
      
  var colors = [ '#DE0D5F', '#FF00B6', '#E800FF', '#9300FF ' ,'#001FFF ', '#0093FF','#1AD3CB ','#4BCF24','#D2CA17 ','#FF6100','#FF0C00'];
      
  //to check if selected searche produced some data
  var noData=true;

  for(i=0;i<data.length;i++){
    if(data[i].value!=0){
      noData=false;
    }
  }

  if(!noData){
    drawPieChart(data, colors);
  }
  else{//in case of no data respecting selected criteria of search
    ctx.clearRect(0, 0, canvas.width, canvas.height);//clearing the context to redraw another pie
  }
}

function searchBoxesRender(){
  if(!level_check.checked){
    level.disabled=true;
  }
  else{
    level.disabled=false;
  } 
  if(!diff_check.checked){
    difficulty.disabled=true;
  }
  else{
    difficulty.disabled=false;
  } 
  if(!input_check.checked){
    input.disabled=true;
  }
  else{
    input.disabled=false;
  }
}

//reading db once to construct the pie charts
function pieRender(){
  if(!already_read_record){
    db.collection("users_scores").doc("scores").get().then(
      function (doc) {
        total_scores=doc.data().scores_record;//reading db
        already_read_record=true;
      }
    )
  }
  buildPie(total_scores);
}
setInterval(pieRender,300);
setInterval(searchBoxesRender,300);