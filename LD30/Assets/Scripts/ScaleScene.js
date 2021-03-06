﻿#pragma strict

var speed:float;
var enableEarly:GameObject;
var illustration:GameObject;
var bookMaterial:Material;
var gameWorldLight:GameObject;
var deskLamp:GameObject;

private var cameraController:MonoBehaviour;
private var startingTime:float;
private var oldMaterials:Material[];
private var tempDontAnimateCamera:boolean = false;
private var animCallback:Function;
private var savedObjectEnables:Hashtable = new Hashtable();
private var savedComponentEnables:Hashtable = new Hashtable();

private var rigidbodies:Rigidbody[];
private var behaviors:Behaviour[];
private var renderers:Renderer[];

private var runningState:int;
private var EXPANDED:int = 0;
private var EXPANDING:int = 1;
private var CONTRACTED:int = 2;
private var CONTRACTING:int = 3;

function backupEnableState() {
    for (var child : Object in transform) {
        var object:GameObject = (child as Transform).gameObject;
        savedObjectEnables[object.GetInstanceID()] = object.activeSelf;
    }
    for (var body : Rigidbody in rigidbodies) {
        savedComponentEnables[body.GetInstanceID()] = !body.isKinematic;
    }
    for (var component : Behaviour in behaviors) {
        savedComponentEnables[component.GetInstanceID()] = component.enabled;
    }
    renderers = GetComponentsInChildren.<Renderer>();
    oldMaterials = new Material[renderers.length];
}

function Start () {
    rigidbodies = GetComponentsInChildren.<Rigidbody>();
    behaviors = GetComponentsInChildren.<Behaviour>();
    cameraController = Camera.main.GetComponent.<MonoBehaviour>();
    runningState = EXPANDED;
    
    tempDontAnimateCamera = true;
    StartAnimation(CONTRACTING);
    setAnimationValues(0.0);
    StartAnimation(CONTRACTED);
    tempDontAnimateCamera = false;
}

function SetCallback(callback:Function) {
    animCallback = callback;
}

function StartAnimation(state:int) {
    var i:int;
    var renderer:Renderer;
    startingTime = Time.time;
    runningState = state;
    if (state == CONTRACTING) {
        backupEnableState();
        enableChildComponents(false);
        
        if (!tempDontAnimateCamera)
            cameraController.Invoke("StartAnimation", 0.0);
        
        for (i = 0; i < renderers.length; i++) {
            renderer = renderers[i];
            oldMaterials[i] = renderer.material;
            var oldTex:Texture = renderer.material.mainTexture;
            renderer.material = bookMaterial;
            renderer.material.SetTexture("_MainTex", oldTex);
        }
    }
    else if (state == EXPANDING) {
        enableChildObjects(true);
        enableEarly.GetComponents.<MonoBehaviour>()[1].enabled = true;
    }
    else if (state == CONTRACTED) {
        enableChildObjects(false);
    }
    else if (state == EXPANDED) {
        enableChildComponents(true);
        
        for (i = 0; i < renderers.length; i++) {
            renderer = renderers[i];
            renderer.material = oldMaterials[i];
        }
    }
}

private function enableChildComponents(enable : boolean) {
    for (var body : Rigidbody in rigidbodies) {
        body.isKinematic = !(enable && savedComponentEnables[body.GetInstanceID()]);
    }
    for (var component : Behaviour in behaviors) {
        if (component !== this) {
            component.enabled = enable && savedComponentEnables[component.GetInstanceID()];
        }
    }
}

private function enableChildObjects(enable : boolean) {
    for (var child : Object in transform) {
        var object:GameObject = (child as Transform).gameObject;
        object.SetActive(enable && savedObjectEnables[object.GetInstanceID()]);
    } 
}

private function setAnimationValues(clock:float) {
    transform.localScale.y = clock;
    
    for (renderer in renderers) {
        renderer.material.SetFloat("_Blend", 1-clock);
    }
    
    illustration.renderer.material.color.a = 1-clock;
    
    for (var ill:GameObject in GameObject.FindGameObjectsWithTag("Illustration")) {
        ill.renderer.material.color.a = 1-clock;
    }
    
    gameWorldLight.light.intensity = clock*0.5;
    deskLamp.light.intensity = 1.0-(clock*1.0);
}

function Update () {
    var renderer:Renderer;
    var i:int;
    if (Input.GetAxis("Fire1")) {
        if (runningState == EXPANDED) {
            StartAnimation(CONTRACTING);
        }
        else if (runningState == CONTRACTED) {
            StartAnimation(EXPANDING);
        }
    }
    var clock:float = (Time.time-startingTime)*speed;
    if (runningState == EXPANDING) {
        setAnimationValues(clock);
        if (clock >= 1.0) {
            StartAnimation(EXPANDED);
            if (animCallback) {
                animCallback();
                animCallback = null;
            }
        }
    }
    else if (runningState == CONTRACTING) {
        setAnimationValues(1-clock);
        if (clock >= 1.0) {
            StartAnimation(CONTRACTED);
            if (animCallback) {
                animCallback();
                animCallback = null;
            }
        }
    }
}
