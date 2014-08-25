#pragma strict

public var bookAnimator:Animator;
public var deskLamp:GameObject;
public var inventory:Array = new Array();

private var gameWorld:GameObject;
private var stickArounds:GameObject[];
private var loadAtEndOfAnimation:String;

function HasItem(search:String):boolean {
    for (var item:String in inventory) {
        if (search.Equals(item)) {
            return true;
        }
    }
    return false;
}

function PopItem(search:String):boolean {
    var i:int;
    for (i = 0; i < inventory.length; i++) {
        if (search.Equals(inventory[i])) {
            inventory.RemoveAt(i);
            return true;
        }
    }
    return false;
}

function PushItem(newItem:String) {
    inventory.Push(newItem);
}

function StartLoadLevel(nextLevel:String) {
    gameWorld.SendMessage("SetCallback", function() {
        for (var o:GameObject in GameObject.FindGameObjectsWithTag("Unload Early")) {
            Destroy(o);
        }
        loadAtEndOfAnimation = nextLevel;
        bookAnimator.SetTrigger("Turn next page");
    });
    gameWorld.SendMessage("StartAnimation", 3);
}

function LevelLoaded() {
    gameWorld = GameObject.FindGameObjectWithTag("Game World");
    gameWorld.GetComponent.<ScaleScene>().deskLamp = deskLamp;
    loadAtEndOfAnimation = null;
}

function OnLevelWasLoaded (level : int) {
    LevelLoaded();
}

function Awake() {
    
}

function Start() {
    // Me
    DontDestroyOnLoad(transform.gameObject);
    
    // The camera
    DontDestroyOnLoad(Camera.main);
    
    // Everything else
	if (stickArounds == null) {
        stickArounds = GameObject.FindGameObjectsWithTag("Stick Around");
    }
    for (var o in stickArounds) {
        DontDestroyOnLoad(o);
    }
    
    Application.LoadLevel("Level1");
}

function Update() {
    if (bookAnimator.GetCurrentAnimatorStateInfo(0).IsName("Page turned")) {
        bookAnimator.SetTrigger("Reset");
        Application.LoadLevel(loadAtEndOfAnimation);
        loadAtEndOfAnimation = null;
    }
}

function OnGUI() {
    var i:int;
    GUI.Box(new Rect(10,10,100,30*inventory.length+30), "Inventory");
    for (i = 0; i < inventory.length; i++) {
        GUI.Label(new Rect(20,30*i+20,80,20), inventory[i].ToString());
    }
}
