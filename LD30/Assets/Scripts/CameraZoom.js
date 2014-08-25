#pragma strict

var targetTransform:Transform;
var speed:float;
private var curve:AnimationCurve;
private var isRunning:boolean;
private var startingPosition:Vector3;
private var startingRotation:Quaternion;

function Start() {
    isRunning = false;
}

function StartAnimation() {
    var now = Time.time;
    curve = AnimationCurve.EaseInOut(now, 0.0, now+speed, 1.0);
    isRunning = true;
    startingPosition.Set(transform.position.x, transform.position.y, transform.position.z);
    startingRotation.Set(transform.rotation.x, transform.rotation.y, transform.rotation.z, transform.rotation.w);
}

function Update () {
    if (isRunning) {
        var clock = curve.Evaluate(Time.time);
        transform.position = Vector3.Lerp(startingPosition, targetTransform.position, clock);
        transform.rotation = Quaternion.Slerp(startingRotation, targetTransform.rotation, clock);
        if (clock >= 1.0) {
            isRunning = false;
        }
    }
}
