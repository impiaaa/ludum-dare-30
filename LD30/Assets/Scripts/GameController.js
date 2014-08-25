#pragma strict

import System.Runtime.Serialization.Formatters.Binary;
import System.IO;

public var bookAnimator:Animator;
public var bookAudio:AudioSource;
public var deskLamp:GameObject;
public var inventory:Array = new Array();
public var loadLevel:String = "Level1";

private var gameWorld:GameObject;
private var stickArounds:GameObject[];
private var loadAtEndOfAnimation:String;
private var savedState:Hashtable = new Hashtable();
private var textController:TextController;

function HasItem(search:String):boolean {
    for (var item:String in inventory.ToBuiltin(String) as String[]) {
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

function ZoomOutToShowBits(showTextBit:int) {
    gameWorld.SendMessage("SetCallback", function() {
        textController.SetCallback(function() {
            gameWorld.SendMessage("StartAnimation", 1);
        });
        textController.ShowBits(showTextBit);
    });
    gameWorld.SendMessage("StartAnimation", 3);
}

function StartLoadLevel(nextLevel:String, next:boolean) {
    gameWorld.SendMessage("SetCallback", function() {
        for (var o:GameObject in GameObject.FindGameObjectsWithTag("Unload Early")) {
            Destroy(o);
        }
        loadAtEndOfAnimation = nextLevel;
        if (next) {
            bookAnimator.SetTrigger("Turn next page");
        }
        else {
            bookAnimator.SetTrigger("Turn previous page");
        }
        bookAudio.Play();
    });
    gameWorld.SendMessage("StartAnimation", 3);
}

function LevelLoaded() {
    gameWorld = GameObject.FindGameObjectWithTag("Game World");
    gameWorld.GetComponent.<ScaleScene>().deskLamp = deskLamp;
    loadAtEndOfAnimation = null;
    textController = FindObjectOfType(TextController) as TextController;
}

function OnLevelWasLoaded (level : int) {
    LevelLoaded();
}

function Awake() {
    Load();
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
}

function Update() {
    if (Application.loadedLevelName.Equals("BaseScene") && loadLevel != null) {
        Application.LoadLevel(loadLevel);
        Debug.Log("GameController loading level "+loadLevel);
        loadLevel = null;
    }
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

function SaveState(key:String, value:Object) {
    savedState[key] = value;
}

function LoadState(key:String, defaultValue:Object) {
    if (savedState.ContainsKey(key)) {
        return savedState[key];
    }
    else {
        return defaultValue;
    }
}

function OnApplicationQuit() {
    Save();
}

function Save() {
    var bf:BinaryFormatter = new BinaryFormatter();
    var file:FileStream = File.Create(Application.persistentDataPath + "/playerInfo.dat", FileMode.Create);
    savedState["_Inventory"] = inventory;
    bf.Serialize(file, savedState);
    file.Close();
}

function Load() {
    if (0 && File.Exists(Application.persistentDataPath + "/playerInfo.dat")) {
        var bf:BinaryFormatter = new BinaryFormatter();
        var file:FileStream = File.Open(Application.persistentDataPath + "/playerInfo.dat", FileMode.Open);
        savedState = bf.Deserialize(file) as Hashtable;
        if (savedState.ContainsKey("_Inventory")) {
            inventory = savedState["_Inventory"] as Array;
        }
        if (inventory == null) {
            inventory = new Array();
        }
        file.Close();
    }
}

function ClearState() {
    inventory = new Array();
    savedState = new Hashtable();
}
