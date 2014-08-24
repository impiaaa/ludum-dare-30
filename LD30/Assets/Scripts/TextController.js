#pragma strict

var textBits:String[];
var bitsShown:int;

private var textMesh:TextMesh;

function Start () {
    textMesh = GetComponent.<TextMesh>();
}

function Update () {
    var str:String = "";
    for (var i:int = 0; i < bitsShown; i++) {
        str += textBits[i];
    }
    textMesh.text = str;
}