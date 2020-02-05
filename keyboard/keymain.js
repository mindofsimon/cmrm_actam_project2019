//MODEL
//Object
var items=[];
//Object constructor
function Item(key,type,pressed){
    this.key=key;//key div (HTML Element)
    this.type=type;//"W"=White,"B"=Black
    this.pressed=pressed//indicates if the key is pressed or not
    this.started=false;//to 
}

//piano
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
    "baseUrl" : "./audio/salamander/"
}).toMaster();

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

keyboard=document.querySelector("#keyboard")
bkcontainer1=document.querySelector("#bkcontainer1")
bkcontainer2=document.querySelector("#bkcontainer2")
bkcontainer3=document.querySelector("#bkcontainer3")
bkcontainer4=document.querySelector("#bkcontainer4")
wkcontainer=document.querySelector("#wkcontainer")

//Creating the keys
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

//VIEW
function render_keys(){
    for(i=0;i<items.length;i++){
        if(!items[i].started){
            if(items[i].pressed==true && items[i].type=="W"){
                items[i].key.classList.add("white_key-selected");
                play(i);
            }
            if(items[i].pressed==true && items[i].type=="B"){
                items[i].key.classList.add("black_key-selected");
                play(i);
            }
        }
        if(items[i].started){
            if(items[i].pressed==false && items[i].type=="W"){
                items[i].key.classList.remove("white_key-selected");
                stop(i);
            }
            if(items[i].pressed==false && items[i].type=="B"){
                items[i].key.classList.remove("black_key-selected");
                stop(i);
            }
        }
    }
}
setInterval(render_keys,50);

//CONTROLLER
function play(position){
        //TRIGGER ATTACK
        if(!items[position].started){
            piano.triggerAttack(active_octave[position]);
            items[i].started=true;
        }
}

function stop(position){
        //TRIGGER RELEASE
        piano.triggerRelease(active_octave[position]);
        items[i].started=false;
}

function selected_key(item,index){
    items[index].pressed=true;
}

function unselected_key(item,index){
    items[index].pressed=false;
}

//MIDI
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

function getMIDIMessage(midiMessage) {
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
    }
    index=midiMessage.data[1]-48;
    if(midiMessage.data[0]==144){
        selected_key(items[index],index);
    }
    else if(midiMessage.data[0]==128){
        unselected_key(items[index],index);
    }
}

//RESUME on click with FadeOut
resume_button=document.querySelector("#resume");
document.onclick=fadeout;

function fadeout() {
    resume_button.style.opacity = '0';
}
resume_button.onclick=fadeout;

score.innerText="SCORE:0/0";


//**************************NOTES************************* */
//put everything in MVC mode

//LOOK AT SAMPLERS

//try to extend note sound depending on key pressure

//look at Event Listener to play with key press/release
//also check Tone.js for piano sounds

//MIDI [1,2,3]-->1:press,2:key
//144-->key pressed
//128-->key released
//keys from 48 to 72 (default octave)
