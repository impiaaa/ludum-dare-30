#pragma strict

var itemName:String;

private var gameController:GameController;
private var hasPickedUp:boolean;

function Start () {
    gameController = GameObject.FindGameObjectWithTag("GameController").GetComponent.<GameController>();
    hasPickedUp = gameController.LoadState(itemName+"HasPickedUp", false);
}

function OnTriggerEnter() {
    if (!hasPickedUp) {
        hasPickedUp = true;
        gameController.SaveState(itemName+"HasPickedUp", hasPickedUp);
        gameController.PushItem(itemName);
    }
}
