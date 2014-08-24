#pragma strict

var speed:float;
var cameraObject:GameObject;
var enableEarly:GameObject;
var bookMaterial:Material;

private var cameraController:MonoBehaviour;
private var hasDisabled:boolean;
private var startingTime:float;
private var oldMaterials:Material[];

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
    runningState = EXPANDED;
    cameraController = cameraObject.GetComponent.<MonoBehaviour>();
}

function StartAnimation(state:int) {
    startingTime = Time.time;
    runningState = state;
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
    for (var child:Transform in transform)
    {
        child.gameObject.SetActive(enable);
    } 
}

function Update () {
    var renderer:Renderer;
    var i:int;
    if (Input.GetAxis("Fire3")) {
        if (runningState == EXPANDED) {
            StartAnimation(CONTRACTING);
            cameraController.Invoke("StartAnimation", 0.0);
            
            for (i = 0; i < renderers.length; i++) {
                renderer = renderers[i];
                oldMaterials[i] = renderer.material;
                var oldTex:Texture = renderer.material.mainTexture;
                renderer.material = bookMaterial;
                renderer.material.SetTexture("_MainTex", oldTex);
            }
        }
        else if (runningState == CONTRACTED) {
            StartAnimation(EXPANDING);
            enableChildObjects(true);
            enableEarly.GetComponents.<MonoBehaviour>()[1].enabled = true;
        }
    }
    var clock = (Time.time-startingTime)*speed;
    if (runningState == EXPANDING) {
        transform.localScale.y = clock;
        
        for (renderer in renderers) {
            renderer.material.SetFloat("_Blend", 1-clock);
        }
        
        if (clock >= 1.0) {
            runningState = EXPANDED;
            enableChildComponents(true);
            hasDisabled = false;
            
            for (i = 0; i < renderers.length; i++) {
                renderer = renderers[i];
                renderer.material = oldMaterials[i];
            }
        }
    }
    else if (runningState == CONTRACTING) {
        if (!hasDisabled) {
            enableChildComponents(false);
            hasDisabled = true;
        }
        
        for (renderer in renderers) {
            renderer.material.SetFloat("_Blend", clock);
        }
        
        transform.localScale.y = 1-clock;
        
        if (clock >= 1.0) {
            enableChildObjects(false);
            runningState = CONTRACTED;
        }
    }
}
