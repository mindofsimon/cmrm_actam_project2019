function foundUser(name,password){
    var found=false;
        for(i=0;i<users.length;i++){
            if(users[i].name==name && users[i].password==password){
                found=true;
            }
        }
    return found;
}

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

//RECOVERING PARAMETERS FROM URL
var users=[];
var name, pass;
let params = new URLSearchParams(location.search);
name=params.get('log_name');
pass=params.get('log_pass');

db.collection("users_data").doc("data").get().then(
    function (doc) {
      users=doc.data().users_record;//reading db
      main_container.classList.remove("display_none");
      if(foundUser(name,pass)){
            loading_div.classList.remove("display_none");
            check_log_div.classList.add("display_none");
            login_label.innerText="WELCOME BACK @"+name+"! YOUR GAME IS LOADING...";
            setTimeout(function(){window.open("game.html?name="+name,"_self")},2500);
        }
        else{
            check_log_div.classList.remove("display_none");
            loading_div.classList.add("display_none");
            login_label.innerText="SOMETHING WENT WRONG...TRY TO CHECK YOUR CREDENTIALS";
        }
    }
)




