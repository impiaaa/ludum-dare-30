#pragma strict

var myLevel:String = null;

function Start () {
    var gameControllerObject:GameObject = GameObject.FindGameObjectWithTag("GameController");
    if (gameControllerObject == null) {
        myLevel = Application.loadedLevelName;
        GameObject.DontDestroyOnLoad(gameObject);
        Application.LoadLevel("BaseScene");
        Debug.Log("Loading BaseScene from "+myLevel);
    }
}

function OnLevelWasLoaded (level : int) {
    if (Application.loadedLevelName.Equals("BaseScene")) {
        Debug.Log("Level "+level+" loaded, transitioning to "+myLevel);
        var gameController:GameController = GameObject.FindGameObjectWithTag("GameController").GetComponent.<GameController>();
        gameController.loadLevel = myLevel;
        myLevel = null;
        GameObject.Destroy(gameObject);
    }
}
