#pragma strict

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

private var rigidbodies:Rigidbody[];
private var behaviors:Behaviour[];
private var renderers:Renderer[];

private var runningState:int;
private var EXPANDED:int = 0;
private var EXPANDING:int = 1;
private var CONTRACTED:int = 2;
private var CONTRACTING:int = 3;

function Start () {
    rigidbodies = GetComponentsInChildren.<Rigidbody>();
    behaviors = GetComponentsInChildren.<Behaviour>();
    renderers = GetComponentsInChildren.<Renderer>();
    oldMaterials = new Material[renderers.length];
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
        body.isKinematic = !enable;
    }
    for (var component : Behaviour in behaviors) {
        if (component !== this) {
            component.enabled = enable;
        }
    }
}

private function enableChildObjects(enable : boolean) {
    for (var child : Transform in transform) {
        child.gameObject.SetActive(enable);
    } 
}

private function setAnimationValues(clock:float) {
    transform.localScale.y = clock;
    
    for (renderer in renderers) {
        renderer.material.SetFloat("_Blend", 1-clock);
    }
    
    illustration.renderer.material.color.a = 1-clock;
    
    gameWorldLight.light.intensity = clock*0.5;
    deskLamp.light.intensity = 1.5-(clock*1.5);
}

function Update () {
    var renderer:Renderer;
    var i:int;
    if (Input.GetAxis("Fire3")) {
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
            if (animCallback) {
                animCallback();
                animCallback = null;
            }
            StartAnimation(EXPANDED);
        }
    }
    else if (runningState == CONTRACTING) {
        setAnimationValues(1-clock);
        if (clock >= 1.0) {
            if (animCallback) {
                animCallback();
                animCallback = null;
            }
            StartAnimation(CONTRACTED);
        }
    }
}
