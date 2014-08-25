#pragma strict

var nextLevel:String;
var nextPage:boolean = true;

function OnTriggerEnter() {
    GameObject.FindWithTag("GameController").GetComponent.<GameController>().StartLoadLevel(nextLevel, nextPage);
}
