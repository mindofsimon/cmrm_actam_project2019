//MODEL
audioCtx=new AudioContext();
var firstNote=261.63;

//Object
var items=[];
//Object constructor
function Item(key,type,pressed){
    this.key=key;//key div (HTML Element)
    this.type=type;//"W"=White,"B"=Black
    this.pressed=pressed//indicates if the key is pressed or not
    this.oscillator_started=false;
}
//I could also include an osicllator or maybe just the gain for every key, so that I can stop it from outside the play function

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
        if(items[i].oscillator_started==false){
            if(items[i].pressed==true && items[i].type=="W"){
                items[i].key.classList.add("white_key-selected");
                play(i);
            }
            if(items[i].pressed==true && items[i].type=="B"){
                items[i].key.classList.add("black_key-selected");
                play(i);
            }
        }
        if(items[i].oscillator_started==true){
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
        items[position].oscillator=audioCtx.createOscillator();
        items[position].oscillator.connect(audioCtx.destination);
        const pitch=(firstNote)*Math.pow(2,position/12);
        items[position].oscillator.frequency.value=pitch;
        items[position].oscillator.start();
        items[position].oscillator_started=true;
}

function stop(position){
        items[position].oscillator.stop();
        items[position].oscillator_started=false
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
    audioCtx.resume();
    resume_button.style.opacity = '0';
}
resume_button.onclick=fadeout;


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