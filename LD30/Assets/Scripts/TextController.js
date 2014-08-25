#pragma strict

var textBits:String[];
var bitsShown:int;
var speed:float;

private var textMesh:TextMesh;
private var startingTime:float;
private var bitsToShow:int;
private var callback:Function;

function Start () {
    textMesh = GetComponent.<TextMesh>();
}

function SetCallback(f:Function) {
    callback = f;
}

function ShowNextBit() {
    ShowBits(bitsShown+1);
}

function ShowBits(bit:int) {
    if (bit >= textBits.length || bit <= bitsShown) {
        return;
    }
    startingTime = Time.time;
    bitsToShow = bit;
}

function Update () {
    if (bitsToShow != bitsShown) {
        var clock = (Time.time-startingTime)*speed;
        var str:String = "";
        var i:int;
        if (clock >= 1) {
            bitsShown = bitsToShow;
            for (i = 0; i < bitsShown; i++) {
                str += textBits[i];
            }
        }
        else {
            for (i = 0; i < bitsShown; i++) {
                str += textBits[i];
            }
            var colorTag:String = String.Format("<color=#000000{0:x2}>", Mathf.FloorToInt(clock*255));
            str += colorTag;
            for (i = bitsShown; i < bitsToShow; i++) {
                str += textBits[i];
            }
            str += "</color>";
        }
        textMesh.text = str;
        if (clock >= 1 && callback != null) {
            callback();
            callback = null;
        }
    }
}