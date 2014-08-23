#pragma strict

private var hasDisabled : boolean;
private var rigidbodies : Rigidbody[];
private var behaviors : Behaviour[];

function Start () {
    rigidbodies = GetComponentsInChildren.<Rigidbody>();
    behaviors = GetComponentsInChildren.<Behaviour>();
}

private function enableEverything(enable : boolean) {
    for (var body : Rigidbody in rigidbodies) {
        body.isKinematic = !enable;
    }
    for (var component : Behaviour in behaviors) {
        if (component !== this) {
            component.enabled = enable;
        }
    }
}

function Update () {
    var flatAmt = Input.GetAxis("Fire3");
    var isFlattening = flatAmt > 0;
    var isFlattened = flatAmt >= 1;
    transform.localScale.y = 1-(flatAmt*0.9);
    if (isFlattening && !hasDisabled) {
        enableEverything(false);
        hasDisabled = true;
    }
    else if (!isFlattening && hasDisabled) {
        enableEverything(true);
        hasDisabled = false;
    }
}