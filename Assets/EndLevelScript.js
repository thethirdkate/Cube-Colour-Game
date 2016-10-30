#pragma strict

public var tilesToGet : int = 0; //will automate this later
private var tilesGot : int = 0;

private var gotAllTiles : boolean = false;

function Start () {

	hideMe();

}

function Update () {

}

function addToTileCount() { 
//we are only ever adding to this count as current logic dictates that once a tile has been successfully
//completed, it can't be changed back to the wrong shape/colour after


	tilesGot++;

	if (tilesToGet==tilesGot) { //we've got all the tiles
		//update the status
		gotAllTiles=true;
		showMe();
	}

	//NOT NEEDED RIGHT NOW
	/*//we haven't got all the tiles any more 
	else if (gotAllTiles) {
		gotAllTiles=false;
		hideMe();
	}*/

}

function showMe() {

	//enable mesh renderer
	GetComponent.<Renderer>().enabled = true; 

}

function hideMe() {

	//disable mesh renderer
	GetComponent.<Renderer>().enabled = false;
	
}

//collision event

function OnTriggerEnter() { 
	Debug.Log("triggered");
	if (gotAllTiles) {
		Application.LoadLevel(Application.loadedLevel);
	}
}