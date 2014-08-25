#pragma strict

var nextLevel:String;

function OnTriggerEnter() {
    GameObject.FindWithTag("GameController").SendMessage("StartLoadLevel", nextLevel);
}
