#pragma strict

var enableObjects:GameObject[];
var disableObjects:GameObject[];
var requiredInventoryItem:String;
var showTextBit:int;

private var showMessage:boolean = false;
private var hasActivated:boolean = false;
private var gameController:GameController;

function Start () {
    gameController = GameObject.FindGameObjectWithTag("GameController").GetComponent.<GameController>();
    hasActivated = gameController.LoadState(requiredInventoryItem+"Triggered", false);
    if (hasActivated) {
        SetActiveObjects();
    }
}

function SetActiveObjects() {
    for (var o:GameObject in enableObjects) {
        o.SetActive(true);
    }
    for (var o:GameObject in disableObjects) {
        o.SetActive(false);
    }
}

function OnTriggerEnter() {
    if (gameController.PopItem(requiredInventoryItem)) {
        gameController.SaveState(requiredInventoryItem+"Triggered", true);
        hasActivated = true;
        SetActiveObjects();
        gameController.ZoomOutToShowBits(showTextBit);
    }
    else {
        showMessage = true;
    }
}

function OnTriggerExit() {
    showMessage = false;
}

function OnGUI() {
    if (showMessage && !hasActivated) {
        GUI.Box(new Rect(Screen.width/2, Screen.height/2, 100, 50), "Need a "+requiredInventoryItem);
    }
}
