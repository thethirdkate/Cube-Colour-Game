#pragma strict


public var tileType : String = "switch";
public var tileState : String = "inactive";

public var successStates : boolean[];
public var successShape : Texture;

public var colourOnePathParent : GameObject;
public var colourOne : Color;
//public var colourTwoPathObjects : Array[];

//private var originalColour : Color;


//public var successColour : Color;


//public var testInt;

//public var siblingTile : GameObject;

function Start () {
			transform.localScale.y = -0.1; //reverse the tile - so it mirrors the cube when stamped upon	
			//originalColour = GetComponent.<Renderer>().material.color;
}

function Update () {

}

function OnCollisionEnter(collision: Collision) {
	//Debug.Log("hit collision");
}


function OnTriggerEnter(col: Collider) {
	//Debug.Log("hit trigger");
	//Debug.Log(col.name);
	if (col.tag=="cubeEdge") {
		//if (col.gameObject.GetComponent.<CubeEdgeScript>().isDownFace) {
			//Debug.Log("hit down face " + col.name);
			col.gameObject.GetComponent.<CubeEdgeScript>().isColliding = true;
			col.gameObject.GetComponent.<CubeEdgeScript>().collidingTile = this.gameObject;
		//}
	}
	//if (col.gameObject.GetComponent.<CubeEdgeScript>().isDownFace) {
	//	Debug.Log("hit down face " + col.name);
	//}
}


function OnTriggerExit(col: Collider) {
	//Debug.Log("hit trigger");
	//Debug.Log(col.name);
	if (col.tag=="cubeEdge") {
		col.gameObject.GetComponent.<CubeEdgeScript>().isColliding = false;
	}
	//if (col.gameObject.GetComponent.<CubeEdgeScript>().isDownFace) {
	//	Debug.Log("hit down face " + col.name);
	//}
}


function openPath(pathNum : int) {

	var pathParent : GameObject;

	if (pathNum==1) { 
		pathParent = colourOnePathParent;
	}

	for (var childTile : Transform in colourOnePathParent.transform) {
		//loop through the children

		//disable the blocker
		var blocker = childTile.Find("Blocker");
		blocker.GetComponent.<PathBlockerScript>().isActive = false;

		//change the shader to grey

		var stampBlock = childTile.Find("StampBlock");
		stampBlock.GetComponent.<Renderer>().material.color = colourOne;



	}


}

function closePath(pathNum : int) {
	var pathParent : GameObject;

	if (pathNum==1) { 
		pathParent = colourOnePathParent;
	}

	for (var childTile : Transform in colourOnePathParent.transform) {
		//loop through the children

		//enable the blocker
		var blocker = childTile.Find("Blocker");
		blocker.GetComponent.<PathBlockerScript>().isActive = true;

		//change the shader to the original

		var stampBlock = childTile.Find("StampBlock");
		stampBlock.GetComponent.<Renderer>().material.color = Color.gray;


	}


}