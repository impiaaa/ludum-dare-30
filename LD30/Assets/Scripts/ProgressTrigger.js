#pragma strict

var enableObjects:GameObject[];
var disableObjects:GameObject[];
var requiredInventoryItem:String;
var showTextBit:int;

private var gameController:GameController;

function Start () {
    gameController = GameObject.FindGameObjectWithTag("GameController").GetComponent.<GameController>();
    if (gameController.LoadState(gameObject.GetInstanceID()+"Triggered", false)) {
        Trigger();
    }
}

function Trigger() {
    gameController.ZoomOutToShowBits(showTextBit);
    for (var o:GameObject in enableObjects) {
        o.SetActive(true);
    }
    for (var o:GameObject in disableObjects) {
        o.SetActive(false);
    }
}

function OnTriggerEnter() {
    if (gameController.PopItem(requiredInventoryItem)) {
        gameController.SaveState(gameObject.GetInstanceID()+"Triggered", true);
        Trigger();
    }
}
