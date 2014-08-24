#pragma strict

var nextLevel:String;

function OnTriggerEnter() {
    Application.LoadLevel(nextLevel);
}
