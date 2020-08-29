/*
Check Registration Page
    -receives data from index page
    -controls if data is correct
    -shows appropriate confirmation/error messages
    -gives opportunity to go back to index page with a link (BACK)
 */

//checking if the selected username is available
function freeUsername(name){
    db.collection("users_data").doc("data").get().then(
        function (doc) {
          users=doc.data().users_record;//reading db
        }
      )
      for(i=0;i<users.length;i++){
          if(users[i].name==name){
              return false;
          }
      }
      return true;
}

//checking if user inserted matching passwords
function matchingPasswords(p1,p2){
    return(p1==p2);
}

//to write user data inside database
function writeDb(name,password){
    db.collection("users_data").doc("data").update({
        users_record: firebase.firestore.FieldValue.arrayUnion({name:name,password:password})
    })
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
var name, pass1, pass2;
let params = new URLSearchParams(location.search);
name=params.get('reg_name');
pass1=params.get('reg_pass1');
pass2=params.get('reg_pass2');

//checking all requirements and showing relative messages
if(freeUsername(name) && matchingPasswords(pass1, pass2)){
    check_reg_img2.classList.remove("display_none");
    check_reg_img.classList.add("display_none");
    writeDb(name, pass1);
    registration_label.innerText="REGISTRATION OK!";
}
else{
    check_reg_img2.classList.add("display_none");
    check_reg_img.classList.remove("display_none");
    if((matchingPasswords(pass1,pass2) && !freeUsername(name))||(!matchingPasswords(pass1,pass2) && !freeUsername(name))){
        registration_label.innerText="SOMETHING WENT WRONG...SELECTED USERNAME IS NOT AVAILABLE";
    }
    else if(!matchingPasswords(pass1,pass2) && freeUsername(name)){
        registration_label.innerText="SOMETHING WENT WRONG...NOT MATCHING PASSWORDS";
    }
}



