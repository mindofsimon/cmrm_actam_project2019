/* 
Game Page
    -keyboard created in js part (not present in HTML page)
    -sampler from Tone.js to generate sounds
*/

//Object (all keyboard keys)
var items=[];
//Object constructor (every single keyboard key element structure)
function Item(key,type,pressed){
    this.key=key;//key div (HTML Element)
    this.type=type;//"W"=White,"B"=Black
    this.pressed=pressed//indicates if the key is pressed or not
    this.started=false;//used to start or terminate correctly a note
}

//game started variable
var game_started=false;

//answer variables
//answer and correct answer behavior:
//["U","U","U"]---> if length is 1--->level=notes
//             ---> if length is 2--->level=intervals
//             ---> if length is 3 (or 4) --->level=chords
//"U" stands for unknown and if it's != "U" it will be a note
var answer=["U"];
var correct_answer=["U"];

//intervals and distances variables
var tonal_distance=[1,2,3,4,5,6,7,8,9,10,11,12];
var distance;//correct distance
var count_released=0;//just for the midi part (to handle keys releasement)

//chords variables
var extracted_chord;
var extracted_chord_index;
var chord_type;
var chord_reference=3;//to update from C to C3 for example

//timeout variable
var to;

//score variable
var current_score=0;

//number of questions
var question_number=0;
var max_questions=10;//keep it fixed, otherwise need to changhe also charts data structure.

//depends on difficulty level, keeps trace whether the question has already been played
var already_played=false;

//piano construction (sampler)
var piano = new Tone.Sampler({
    "A0" : "A0.[mp3|ogg]",
    "C1" : "C1.[mp3|ogg]",
    "D#1" : "Ds1.[mp3|ogg]",
    "F#1" : "Fs1.[mp3|ogg]",
    "A1" : "A1.[mp3|ogg]",
    "C2" : "C2.[mp3|ogg]",
    "D#2" : "Ds2.[mp3|ogg]",
    "F#2" : "Fs2.[mp3|ogg]",
    "A2" : "A2.[mp3|ogg]",
    "C3" : "C3.[mp3|ogg]",
    "D#3" : "Ds3.[mp3|ogg]",
    "F#3" : "Fs3.[mp3|ogg]",
    "A3" : "A3.[mp3|ogg]",
    "C4" : "C4.[mp3|ogg]",
    "D#4" : "Ds4.[mp3|ogg]",
    "F#4" : "Fs4.[mp3|ogg]",
    "A4" : "A4.[mp3|ogg]",
    "C5" : "C5.[mp3|ogg]",
    "D#5" : "Ds5.[mp3|ogg]",
    "F#5" : "Fs5.[mp3|ogg]",
    "A5" : "A5.[mp3|ogg]",
    "C6" : "C6.[mp3|ogg]",
    "D#6" : "Ds6.[mp3|ogg]",
    "F#6" : "Fs6.[mp3|ogg]",
    "A6" : "A6.[mp3|ogg]",
    "C7" : "C7.[mp3|ogg]",
    "D#7" : "Ds7.[mp3|ogg]",
    "F#7" : "Fs7.[mp3|ogg]",
    "A7" : "A7.[mp3|ogg]",
    "C8" : "C8.[mp3|ogg]"
}, {
    "release" : 1,
    "baseUrl" : "audio/salamander/"
}).toMaster();

//various octaves
notes01=["","","","","","","","","","","","","C0","C#0","D0","D#0","E0","F0","F#0","G0","G#0","A0","A#0","B0","C1"];
notes01=["C0","C#0","D0","D#0","E0","F0","F#0","G0","G#0","A0","A#0","B0","C1","C#1","D1","D#1","E1","F1","F#1","G1","G#1","A1","A#1","B1","C2"];
notes12=["C1","C#1","D1","D#1","E1","F1","F#1","G1","G#1","A1","A#1","B1","C2","C#2","D2","D#2","E2","F2","F#2","G2","G#2","A2","A#2","B2","C3"];
notes23=["C2","C#2","D2","D#2","E2","F2","F#2","G2","G#2","A2","A#2","B2","C3","C#3","D3","D#3","E3","F3","F#3","G3","G#3","A3","A#3","B3","C4"];
notes34=["C3","C#3","D3","D#3","E3","F3","F#3","G3","G#3","A3","A#3","B3","C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4","C5"];
notes45=["C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4","C5","C#5","D5","D#5","E5","F5","F#5","G5","G#5","A5","A#5","B5","C6"];
notes56=["C5","C#5","D5","D#5","E5","F5","F#5","G5","G#5","A5","A#5","B5","C6","C#6","D6","D#6","E6","F6","F#6","G6","G#6","A6","A#6","B6","C7"];
notes67=["C6","C#6","D6","D#6","E6","F6","F#6","G6","G#6","A6","A#6","B6","C7","C#7","D7","D#7","E7","F7","F#7","G7","G#7","A7","A#7","B7","C8"];
notes78=["C7","C#7","D7","D#7","E7","F7","F#7","G7","G#7","A7","A#7","B7","C8","C#8","D8","D#8","E8","F8","F#8","G8","G#8","A8","A#8","B8","C9"];
notes8=["C8","C#8","D8","D#8","E8","F8","F#8","G8","G#8","A8","A#8","B8","","","","","","","","","","","","",""];
active_octave=notes34;//default octave

//various chords depending on tonal reference
//Note that every array has:
//maj/maj7/min/min7,min,min7,maj,maj7,dom7,min,min7,hdim7
chords1=["C","Cmaj7","Dmin","Dmin7","Emin","Emin7","F","Fmaj7","G7","Amin","Amin7","Bm7b5"]//C
chords2=["C#","C#maj7","D#min","D#min7","Fmin","Fmin7","F#","F#maj7","G#7","A#min","A#min7","Cm7b5"]//C#
chords3=["D","Dmaj7","Emin","Emin7","F#min","F#min7","G","Gmaj7","A7","Bmin","Bmin7","C#m7b5"]//D 
chords4=["D#","D#maj7","Fmin","Fmin7","Gmin","Gmin7","G#","G#maj7","A#7","Cmin","Cmin7","Dm7b5"]//D#
chords5=["E","Emaj7","F#min","F#min7","G#min","G#min7","A","Amaj7","B7","C#min","C#min7","D#m7b5"]//E
chords6=["F","Fmaj7","Gmin","Gmin7","Amin","Amin7","A#","A#maj7","C7","Dmin","Dmin7","Em7b5"]//F
chords7=["F#","F#maj7","G#min","G#min7","A#min","A#min7","B","Bmaj7","C#7","D#min","D#min7","Fm7b5"]//F#
chords8=["G","Gmaj7","Amin","Amin7","Bmin","Bmin7","C","Cmaj7","D7","Emin","Emin7","F#m7b5"]//G
chords9=["G#","G#maj7","A#min","A#min7","Cmin","Cmin7","C#","C#maj7","D#7","Fmin","Fmin7","Gm7b5"]//G#
chords10=["A","Amaj7","Bmin","Bmin7","C#min","C#min7","D","Dmaj7","E7","F#min","F#min7","G#m7b5"]//A 
chords11=["A#","A#maj7","Cmin","Cmin7","Dmin","Dmin7","D#","D#maj7","F7","Gmin","Gmin7","Am7b5"]//A#
chords12=["B","Bmaj7","C#min","C#min7","D#min","D#min7","E","Emaj7","F#7","G#min","G#min7","A#m7b5"]//B
active_chords=chords1;//default chords

//levels variables
var notes=active_octave;
var intervals=["m2","M2","m3","M3","P4","A4","P5","m6","M6","m7","M7","O"];
var chords=["maj","maj7","min","min7","dom7","hdim7"];
var active_level;

//active user (recovering data from URL)
var name;
let params = new URLSearchParams(location.search);
name=params.get('name');
username_label.innerText="@"+name;

keyboard=document.querySelector("#keyboard")
bkcontainer1=document.querySelector("#bkcontainer1")
bkcontainer2=document.querySelector("#bkcontainer2")
bkcontainer3=document.querySelector("#bkcontainer3")
bkcontainer4=document.querySelector("#bkcontainer4")
wkcontainer=document.querySelector("#wkcontainer")

//Creating the keyboard keys
function loadWhiteKeys(){
    for(var i=0;i<5;i=i+2){
        items[i]=new Item(document.createElement("div"),"W",false);
        items[i].key.classList.add("white_key")
        wkcontainer.appendChild(items[i].key)
    }
    for(var i=5;i<12;i=i+2){
        items[i]=new Item(document.createElement("div"),"W",false);
        items[i].key.classList.add("white_key")
        wkcontainer.appendChild(items[i].key)
    }
    for(var i=12;i<17;i=i+2){
        items[i]=new Item(document.createElement("div"),"W",false);
        items[i].key.classList.add("white_key")
        wkcontainer.appendChild(items[i].key)
    }
    for(var i=17;i<24;i=i+2){
        items[i]=new Item(document.createElement("div"),"W",false);
        items[i].key.classList.add("white_key")
        wkcontainer.appendChild(items[i].key)
    }
    items[24]=new Item(document.createElement("div"),"W",false);
    items[24].key.classList.add("white_key")
    wkcontainer.appendChild(items[24].key)

}

function loadBlackKeys(){
    for(var i=1;i<4;i=i+2){
        items[i]=new Item(document.createElement("div"),"B",false);
        items[i].key.classList.add("black_key")
        bkcontainer1.appendChild(items[i].key)
    }
    for(var i=6;i<11;i=i+2){
        items[i]=new Item(document.createElement("div"),"B",false);
        items[i].key.classList.add("black_key")
        bkcontainer2.appendChild(items[i].key)
    }
    for(var i=13;i<16;i=i+2){
        items[i]=new Item(document.createElement("div"),"B",false);
        items[i].key.classList.add("black_key")
        bkcontainer3.appendChild(items[i].key)
    }
    for(var i=18;i<23;i=i+2){
        items[i]=new Item(document.createElement("div"),"B",false);
        items[i].key.classList.add("black_key")
        bkcontainer4.appendChild(items[i].key)
    }
}

//Creating the keyboard
function loadKeyboard(){
    loadWhiteKeys();
    loadBlackKeys();
}
loadKeyboard();

//render functions
function render_keys(){
    for(i=0;i<items.length;i++){
        if(!items[i].started){
            if(items[i].pressed==true && items[i].type=="W"){
                items[i].key.classList.add("white_key-selected");
                play_note(i);
            }
            if(items[i].pressed==true && items[i].type=="B"){
                items[i].key.classList.add("black_key-selected");
                play_note(i);
            }
        }
        if(items[i].started){
            if(items[i].pressed==false && items[i].type=="W"){
                items[i].key.classList.remove("white_key-selected");
                stop_note(i);
            }
            if(items[i].pressed==false && items[i].type=="B"){
                items[i].key.classList.remove("black_key-selected");
                stop_note(i);
            }
        }
    }
}
setInterval(render_keys,50);

//play/stop note functions
function play_note(position){
        //TRIGGER ATTACK
        if(!items[position].started){
            piano.triggerAttack(active_octave[position]);
            items[position].started=true;
        }
}

function stop_note(position){
        //TRIGGER RELEASE
        piano.triggerRelease(active_octave[position]);
        items[position].started=false;
}

//to show key pressure/releasement
function selected_key(item,index){
    items[index].pressed=true;
}

function unselected_key(item,index){
    items[index].pressed=false;
}

//midi part
navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
    console.log(midiAccess);

    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;
}

function onMIDIFailure() {
    console.log('Error');
}

function onMIDISuccess(midiAccess) {
    for (var input of midiAccess.inputs.values())
        input.onmidimessage = getMIDIMessage;
}


//to check whether two arrays are equal or not
function areEqual(arr1,arr2){
    //I don't need to check the length of the arrays
    for(i=0;i<arr1.length;i++){
        if(arr1[i]!=arr2[i]){
            return false;
        }
    }
    return true;
}

//returns note index given correct (note) answer
function find_correct_note_index(correct){
    for(i=0;i<active_octave.length;i++){
        if(active_octave[i]==correct){
            return i;
        }
    }
    return 0;//anyway if everything is ok we should never get here
}

//chords answer update function
function update_chord_answer(){
    if(answer[1]=="U"){
        count_released=3;//forcing the release of the missing notes(3)
    }
    else if(answer[2]=="U"){
        count_released=2;//forcing the release of the missing notes(2)
    }
    else if(answer[3]=="U"){
        count_released=1;//forcing the release of the missing note
    }
}  

//just to have a feedback
function prova(){
    for(i=0;i<items.length;i++){
        console.log(items[i].key.classList);
    }
}

//checking chords answer given by user
function check_chord_answer(){
    if(answer[1]!="U" && answer[2]!="U"){
        if((correct_answer.length==3 && answer[3]=="U")||(correct_answer.length==4 && answer[3]!="U")){
            if(areEqual(correct_answer.sort(),answer.sort())){
                goodans.classList.add("goodanson")
                current_score++;
            }
            else{
                wrongans.classList.add("wronganson")
                if(difficulty.value=="hard"&&current_score>0){
                    current_score=current_score-1
                }
            }
        }
        else{
            wrongans.classList.add("wronganson")
            if(difficulty.value=="hard"&&current_score>0){
                current_score=current_score-1
            }
        }
    }
    else{
        wrongans.classList.add("wronganson")
        if(difficulty.value=="hard"&&current_score>0){
            current_score=current_score-1
        }
    }
    correct_ans_index=find_correct_note_index(correct_answer[0]);
    if(items[correct_ans_index].type=="W"){
        items[correct_ans_index].key.classList.add("white_key-selected")
    }
    else{
        items[correct_ans_index].key.classList.add("black_key-selected")
    }
    correct_ans_index=find_correct_note_index(correct_answer[1]);
    if(items[correct_ans_index].type=="W"){
        items[correct_ans_index].key.classList.add("white_key-selected")
    }
    else{
        items[correct_ans_index].key.classList.add("black_key-selected")
    }
    correct_ans_index=find_correct_note_index(correct_answer[2]);
    if(items[correct_ans_index].type=="W"){
        items[correct_ans_index].key.classList.add("white_key-selected")
    }
    else{
        items[correct_ans_index].key.classList.add("black_key-selected")
    }
    if(correct_answer.length==4){
        correct_ans_index=find_correct_note_index(correct_answer[3]);
        if(items[correct_ans_index].type=="W"){
            items[correct_ans_index].key.classList.add("white_key-selected")
        }
        else{
            items[correct_ans_index].key.classList.add("black_key-selected")
        }
    }
    score_label.innerText="SCORE:"+current_score+"/"+question_number;
    correct_answer=["U","U","U"];
    count_released=0;
}

//interval answer update function
function update_interval_answer(){
    if(answer[1]=="U"){
        count_released=1;//forcing the release of the missing note
    }
}

//checking interval answer given by user
function check_interval_answer(){
    if(answer[1]!="U" && Math.abs(find_correct_ans_index(answer[0])-find_correct_ans_index(answer[1]))==distance){
        goodans.classList.add("goodanson")
        current_score++;
    }
    else{
        wrongans.classList.add("wronganson")
        if(difficulty.value=="hard"&&current_score>0){
            current_score=current_score-1
        }
    }
    correct_ans_index=find_correct_note_index(correct_answer[0]);
    if(items[correct_ans_index].type=="W"){
        items[correct_ans_index].key.classList.add("white_key-selected")
    }
    else{
        items[correct_ans_index].key.classList.add("black_key-selected")
    }
    correct_ans_index=find_correct_note_index(correct_answer[1]);
    if(items[correct_ans_index].type=="W"){
        items[correct_ans_index].key.classList.add("white_key-selected")
    }
    else{
        items[correct_ans_index].key.classList.add("black_key-selected")
    }
    score_label.innerText="SCORE:"+current_score+"/"+question_number;
    correct_answer=["U","U"];
    count_released=0;
}

//checking note answer given by user
function check_note_answer(){
    if(answer[0]==correct_answer[0]){
        goodans.classList.add("goodanson")
        current_score++;
    }
    else{
        wrongans.classList.add("wronganson")
        if(difficulty.value=="hard"&&current_score>0){
            current_score=current_score-1
        }
    }
    correct_ans_index=find_correct_note_index(correct_answer[0]);
    if(items[correct_ans_index].type=="W"){
        items[correct_ans_index].key.classList.add("white_key-selected")
    }
    else{
        items[correct_ans_index].key.classList.add("black_key-selected")
    }
}

//MIDI input section
function getMIDIMessage(midiMessage) {//maybe I'll need one if for every level to handle different games
    if(input_type.value=="midi-keyboard"){
        index=midiMessage.data[1]-48;
        //NOTES
        if(correct_answer[0]!="U" && correct_answer.length==1){
            if(answer[0]=="U" && game_started){//in this way I can do one note at time if the game is started
                if(midiMessage.data[0]==144){
                    selected_key(items[index],index);
                    answer[0]=notes[index];
                }
            }
            if(midiMessage.data[0]==128){
                unselected_key(items[index],index);
                setTimeout(check_note_answer,100);//needed for the latency of the key selection/unselection
                score_label.innerText="SCORE:"+current_score+"/"+question_number;
                setTimeout(function(){correct_answer=["U"]},100);//needed for the latency of the correct answer highlight
            }
        }
        //INTERVALS
        else if(correct_answer[0]!="U" && correct_answer[1]!="U" && correct_answer.length==2){
            if((answer[0]=="U"||answer[1]=="U") && game_started){
                if(midiMessage.data[0]==144){
                    selected_key(items[index],index);
                    if(answer[0]=="U"){
                        answer[0]=notes[index];
                        to=setTimeout(update_interval_answer,500)//I want them to be pressed almost toghether
                    }
                    else{
                        answer[1]=notes[index]; 
                    }
                }
            }
            if(midiMessage.data[0]==128){
                unselected_key(items[index],index);
                count_released++;
                if(count_released==2){
                    setTimeout(check_interval_answer,100);//needed for the latency of the key selection/unselection
                }
            }
        }
        //CHORDS
        else if(correct_answer[0]!="U" && correct_answer[1]!="U" && correct_answer[2]!="U" && correct_answer.length>=3){
            if((answer[0]=="U"||answer[1]=="U"||answer[2]=="U"||answer[3]=="U") && game_started){
                answer[3]="U";
                if(midiMessage.data[0]==144){
                    selected_key(items[index],index);
                    if(answer[0]=="U"){
                        answer[0]=notes[index];
                        to=setTimeout(update_chord_answer,500)//I want them to be pressed almost toghether
                    }
                    else if(answer[1]=="U"){
                        answer[1]=notes[index]; 
                    }
                    else if(answer[2]=="U"){
                        answer[2]=notes[index];
                    }
                    else if(answer[3]=="U"){
                        answer[3]=notes[index]; 
                    }
                }
            }
            if(midiMessage.data[0]==128){
                unselected_key(items[index],index);
                count_released++;
                if(count_released==4){
                    setTimeout(check_chord_answer,100);//needed for the latency of the key selection/unselection
                }
            }
        }
    }
}

//settings functions
function disable_settings(){
    settings.classList.remove("enabled_settings")
    settings.classList.add("locked_settings")
    difficulty.disabled=true
    octave.disabled=true
    tonal_reference.disabled=true
    level.disabled=true
    input_type.disabled=true
    document.querySelector("#start").disabled=true
    difficulty.enabled=false
    octave.enabled=false
    tonal_reference.enabled=false
    level.enabled=false
    input_type.enabled=false
    document.querySelector("#start").enabled=false
}

function enable_settings(){
    settings.classList.remove("locked_settings")
    settings.classList.add("enabled_settings")
    difficulty.disabled=false
    tonal_reference.disabled=false
    level.disabled=false
    input_type.disabled=false
    document.querySelector("#start").disabled=false
    difficulty.enabled=true
    tonal_reference.enabled=true
    level.enabled=true
    input_type.enabled=true
    document.querySelector("#start").enabled=true
    if(level.value!="chords"){
        octave.enabled=true
        octave.disabled=false
    }
}

//setting active notes/intervals/chords depending on selected settings 
function set_level(){
    switch(octave.value){
        case "c0c2":
            active_octave=notes01;
        break;
        case "c1c3":
            active_octave=notes12;
        break;
        case "c2c4":
            active_octave=notes23;
        break;
        case "c3c5":
            active_octave=notes34;
        break;
        case "c4c6":
            active_octave=notes45;
        break;
        case "c5c7":
            active_octave=notes56;
        break;
        case "c6c8":
            active_octave=notes67;
        break;
        case "c7c9":
            active_octave=notes78;
        break;
        default:
            active_octave=notes34;
        break;
    }
    notes=active_octave;
    switch(tonal_reference.value){
        case "C":
            active_chords=chords1;
        break;
        case "C#":
            active_chords=chords2;
        break;
        case "D":
            active_chords=chords3;
        break;
        case "D#":
            active_chords=chords4;
        break;
        case "E":
            active_chords=chords5;
        break;
        case "F":
            active_chords=chords6;
        break;
        case "F#":
            active_chords=chords7;
        break;
        case "G":
            active_chords=chords8;
        break;
        case "G#":
            active_chords=chords9;
        break;
        case "A":
            active_chords=chords10;
        break;
        case "A#":
            active_chords=chords11;
        break;
        case "B":
            active_chords=chords12;
        break;
        default:
            active_chords=chords1;
        break;
    }
    switch(level.value){
        case "notes":
            active_level=notes;
            correct_answer=["U"]
            if(input_type.value=="midi-keyboard"){
                answer=["U"]
            }
        break;
        case "intervals":
            active_level=intervals;
            correct_answer=["U","U"]
            if(input_type.value=="midi-keyboard"){
                answer=["U","U"]
            }
        break;
        case "chords":
            active_level=chords;
            correct_answer=["U","U","U"]
            if(input_type.value=="midi-keyboard"){
                answer=["U","U","U"]
            }
        break;
    }
}

//to select which table to show (for mouse input only)
function show_table(){
    switch(level.value){
        case "notes":
            notes_table.classList.remove("display_none")
        break;
        case "intervals":
            intervals_table.classList.remove("display_none")
        break;
        case "chords":
            chords_table.classList.remove("display_none")
        break;
    }
}

//setting chord type
function set_chord_type(index){
    switch(index){
        case 0:
        case 6:
            chord_type="maj"
        break;
        case 1:
        case 7:
            chord_type="maj7"
        break;
        case 2:
        case 4:
        case 9:
            chord_type="min"
        break;
        case 3:
        case 5:
        case 10:
            chord_type="min7"
        break;
        case 8:
            chord_type="dom7"
        break;
        case 11:
            chord_type="hdim7"
        break;
    }
}

//simplifies note expression through Tonal.Note
function note_conversion(chord_notes){//to simplify the notes
    for(i=0;i<chord_notes.length;i++){
        chord_notes[i]=Tonal.Note.simplify(chord_notes[i])
    }
    return chord_notes;
}

//finds note index given note name
function find_note_index(note){
    generic_octave=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    for(i=0;i<generic_octave.length;i++){
        if(note==generic_octave[i]){
            return(i);
        }
    }
}

//to handle chords correctly
function note_correction(chord_notes){
    //First note become for example B--->B3
    //then I check if next one goes one octave above
    var i=0;
    var j=0;
    var rest="";
    var corr_notes=[];
    if(chord_notes[0].length==1){//ex:A
        first_char=chord_notes[0][0];
        corr_notes[0]=first_char.concat(chord_reference);
    }
    else{//ex:A#
        first_char=chord_notes[0][0];
        first_two_chars=first_char.concat(chord_notes[0][1]);
        corr_notes[0]=first_two_chars.concat(chord_reference);
    }
    for(i=1;i<chord_notes.length;i++){
        if(!(find_note_index(chord_notes[i])>find_note_index(chord_notes[i-1])&&find_note_index(chord_notes[i])<=find_note_index("B"))){
            chord_reference="4";
        }
        if(chord_notes[i].length==1){//ex:A
            first_char=chord_notes[i][0];
            corr_notes[i]=first_char.concat(chord_reference);
        }
        else{//ex:A#
            first_char=chord_notes[i][0];
            first_two_chars=first_char.concat(chord_notes[i][1]);
            corr_notes[i]=first_two_chars.concat(chord_reference);
        }
    }
    chord_reference="3";
    return corr_notes;
}

//everytime a new question is called
function question(){
    question_number++;
    //setting correct answer
    switch(level.value){
        case "notes":
            correct_answer[0]=active_level[Math.round(Math.random()*(active_level.length))]//from 0 to array length
        break;
        case "intervals":
            do{
                correct_answer[0]=notes[Math.round(Math.random()*(active_level.length))]
                correct_answer[1]=notes[Math.round(Math.random()*(active_level.length))]
                distance=Math.abs(find_correct_ans_index(correct_answer[0])-find_correct_ans_index(correct_answer[1]))
            }while(distance>12 || distance==0);
        break;
        case "chords":
            extracted_chord_index=Math.round(Math.random()*active_chords.length);//index extraction
            extracted_chord=active_chords[extracted_chord_index];//chord extraction
            chord_notes=Tonal.Chord.chord(extracted_chord).notes//notes extraction
            chord_notes=note_conversion(chord_notes);//notes simplified ex:A##--->B
            chord_notes=note_correction(chord_notes);//adding numbers ex:A--->A3
            set_chord_type(extracted_chord_index);//chord type
            correct_answer=chord_notes;
        break;
    }
    questions_label.innerText="Question: "+question_number+"/10";
}

//start button function
function start(){
    game_started=true;
    score_label.innerText="SCORE:0/0";
    disable_settings();
    set_level();
    if(input_type.value=="mouse"){
        show_table();
    }
    question();//first one, then others will by called by NEXT button

}

//charts button function
function charts(){
    window.open("charts.html?name="+name);
}

//info button function
function info(){
    window.open("prova.txt")//to substitute with a pdf containing game informations
}

//restart button functions
function hide_tables(){
    notes_table.classList.add("display_none")
    intervals_table.classList.add("display_none")
    chords_table.classList.add("display_none")
}

function hide_registration(){
    registration_section.classList.add("display_none")
}

function restart(){
    game_started=false;
    document.querySelectorAll(".box").forEach(function(box){box.classList.remove("correct_option")})
    document.querySelectorAll(".white_key").forEach(function(key){key.classList.remove("white_key-selected")})
    document.querySelectorAll(".black_key").forEach(function(key){key.classList.remove("black_key-selected")})
    goodans.classList.remove("goodanson")
    wrongans.classList.remove("wronganson")
    current_score=0;
    question_number=0;
    correct_answer=["U"]
    answer=["U"]
    score_label.innerText="";
    questions_label.innerText="";
    already_played=false;
    hide_tables();
    hide_registration();
    enable_settings();
}

//Score registration functions
function show_registration(){
    registration_section.classList.remove("display_none")
}

//to write data on database
function write_db(username,points,diff,input,lev){
    db.collection("users_scores").doc("scores").update({
        scores_record: firebase.firestore.FieldValue.arrayUnion({name:username,score:points,difficulty:diff,input:input,level:lev})
    })
}

//to register user score
function register_score(){
    register.onclick=function(){
        write_db(name,current_score,difficulty.value,input_type.value,level.value);
        restart();
    }
}

//Next button function
function next(){
    if(game_started){
        if(question_number==max_questions){
            score_label.innerText="SCORE:"+current_score+"/"+question_number;
            show_registration();
            register_score();
        }
        else{
            if(answer[0]=="U"){//it's the case in which user presses NEXT wihout giving an answer
                score_label.innerText="SCORE:"+current_score+"/"+question_number;
            }
            document.querySelectorAll(".box").forEach(function(box){box.classList.remove("correct_option")})
            document.querySelectorAll(".white_key").forEach(function(key){key.classList.remove("white_key-selected")})
            document.querySelectorAll(".black_key").forEach(function(key){key.classList.remove("black_key-selected")})
            goodans.classList.remove("goodanson")
            wrongans.classList.remove("wronganson")
            question();
            for(i=0;i<answer.length;i++){
                answer[i]="U";
            }
        }
    }
}

//Play button function
function play_question(){
    if(game_started){
        if(difficulty.value=="low"||(difficulty.value=="medium" && !already_played)||(difficulty.value=="hard" && !already_played))
            if(correct_answer!=["U"] && correct_answer.length==1){
                piano.triggerAttack(correct_answer)
            }
            else if(correct_answer!=["U","U"] && correct_answer.length==2){
                piano.triggerAttack(correct_answer[0])
                piano.triggerAttack(correct_answer[1])   
            }
            else if(correct_answer!=["U","U","U"] && correct_answer.length>=3){
                for(i=0;i<correct_answer.length;i++){
                    piano.triggerAttack(correct_answer[i])
                }   
            }
            already_played=true;
    }
}

//boxes highlighting functions
function selection(box){
    box.onmouseover=function(){
        box.classList.add("h_box")
    }
}

function deselection(box){
    box.onmouseleave=function(){
        box.classList.remove("h_box")
    }
}

//boxes click functions
function find_correct_ans_index(correct){
    for(i=0;i<active_level.length;i++){//maybe move to active_level to handle all levels
        if(active_octave[i]==correct){
            return i;
        }
    }
    return 0;//anyway if everything is ok we should never get here
}

//to find chord type
function find_chord_type_index(c){
    switch (c){
        case "maj":
            ind=0;
        break;
        case "maj7":
            ind=1;
        break;
        case "min":
            ind=2;
        break;
        case "min7":
            ind=3;
        break;
        case "dom7":
            ind=8;
        break;
        case "hdim7":
            ind=11;
        break;
    }
    return ind;
}

//to handle mouse input
function handle_click(box,index,boxes){
    box.onclick=function(){
        if(correct_answer[0]!="U" && correct_answer.length==1){
            answer[0]=active_octave[index];
            piano.triggerAttack(answer[0])
            if(answer[0]==correct_answer[0]){
                goodans.classList.add("goodanson")
                current_score++;
            }
            else{
                wrongans.classList.add("wronganson")
                if(difficulty.value=="hard"&&current_score>0){
                    current_score=current_score-1
                }
            }
            correct_ans_index=find_correct_note_index(correct_answer[0]);
            boxes[correct_ans_index].classList.add("correct_option")
            score_label.innerText="SCORE:"+current_score+"/"+question_number;
            correct_answer=["U"];
        }
        else if(correct_answer[0]!="U" && correct_answer[1]!="U" && correct_answer.length==2){
            answer[0]=intervals[index-25];//play attention! boxes are also notes and chords boxes!
            if(distance==tonal_distance[index-25]){
                piano.triggerAttack(correct_answer[0])
                piano.triggerAttack(correct_answer[1])
                goodans.classList.add("goodanson")
                current_score++;
            }
            else{
                piano.triggerAttack(notes[0])
                piano.triggerAttack(notes[index-25])//I play the default interval with this distance
                wrongans.classList.add("wronganson")
                if(difficulty.value=="hard"&&current_score>0){
                    current_score=current_score-1
                }
            }
            boxes[distance-1+25].classList.add("correct_option")//it's the correct answer location
            score_label.innerText="SCORE:"+current_score+"/"+question_number;
            correct_answer=["U","U"];
        }
        //check if i have to control also the fourth note...
        else if(correct_answer[0]!="U" && correct_answer[1]!="U" && correct_answer[2]!="U" && correct_answer.length>=3){
            answer[0]=chords[index-37];//play attention! boxes are also notes and chords boxes!
            if(chord_type==box.id){//if answer is correct I play the correct answer(exactly that)
                for(i=0;i<correct_answer.length;i++){
                    piano.triggerAttack(correct_answer[i])
                }
                goodans.classList.add("goodanson")
                current_score++;
            }
            else{//if answer is wrong I play a generic chord with charateristics of user answer chord(default one)
                ans_chord_type_index=find_chord_type_index(box.id)
                ans_chord_notes=Tonal.Chord.chord(active_chords[ans_chord_type_index]).notes
                ans_chord_notes=note_conversion(ans_chord_notes)
                ans_chord_notes=note_correction(ans_chord_notes)
                for(i=0;i<ans_chord_notes.length;i++){
                    piano.triggerAttack(ans_chord_notes[i])
                }
                wrongans.classList.add("wronganson")
                if(difficulty.value=="hard"&&current_score>0){
                    current_score=current_score-1
                }
            }
            document.querySelector("#"+chord_type).classList.add("correct_option")//it's the correct answer location
            score_label.innerText="SCORE:"+current_score+"/"+question_number;
            correct_answer=["U","U","U"];
        }
    }
}

document.querySelectorAll(".box").forEach(selection)
document.querySelectorAll(".box").forEach(deselection)
document.querySelectorAll(".box").forEach(handle_click)//one table active(visible) at time, so don't need to check type of box

//disable octave choice when Chords level is selected
document.querySelector("#level").onchange=function(){
    if(level.value=="chords"){
        document.querySelector("#octave").value="c3c5"
        document.querySelector("#octave").disabled=true;
    }
    else{
        document.querySelector("#octave").disabled=false;
    }
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