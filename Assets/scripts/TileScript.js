#pragma strict


public var tileType : String;
public var tileState : String = "inactive";

public var successStates : boolean[];
public var successShape : Texture;


public var successColour : Color;


//public var testInt;

//public var siblingTile : GameObject;

function Start () {
			transform.localScale.y = -0.1; //reverse the tile - so it mirrors the cube when stamped upon	
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