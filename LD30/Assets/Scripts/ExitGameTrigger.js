#pragma strict

function Start () {
    if (Application.isWebPlayer || Application.platform == RuntimePlatform.IPhonePlayer) {
        Debug.Log("Quit disabled");
        gameObject.SetActive(false);
    }
}

function OnTriggerEnter () {
    Debug.Log("Quitting");
    Application.Quit();
}
