var rotator : Transform;
var speed = 1.0;
var rotating = false;
var halfCubeSize = 0.5;

var cubeRend: Renderer;
var tileRend: Renderer;

public var downFace : GameObject;

function RotateCube(refPoint : Vector3, rotationAxis : Vector3)
{
    rotator.localRotation = Quaternion.identity;
	rotator.position = transform.position -Vector3.up*halfCubeSize + refPoint;
	transform.parent = rotator;
	var angle : float = 0;
	while(angle < 90.0)
	{
	    angle += Time.deltaTime*90.0*speed;
		rotator.rotation = Quaternion.AngleAxis(Mathf.Min(angle,90.0),rotationAxis);
	    yield;
	}
	GetComponent.<AudioSource>().PlayOneShot(GetComponent.<AudioSource>().clip);
    transform.parent = null;
	rotating = false;
	calcFaceDown();
	calcCollision();
	//Debug.Log("done rotating");
}


function Start()
{
    rotator = (new GameObject("Rotator")).transform;
    calcFaceDown();
}

function calcFaceDown() {
	//find out which face is down
	//get the y position of all the child objects
	//the one with the lowest is the down face
	var lowestY : float =99;
	var lowestChild : GameObject;
	for (var child : Transform in transform) {
	  // Debug.Log(child.name);
	   //	Debug.Log(child.name + " is at " + child.position.y);
	   //	Debug.Log(lowestY);
	   if (child.position.y<lowestY) { 
	   //	Debug.Log(child.name + " is lower");
	   	lowestY=child.position.y;
	   	lowestChild=child.gameObject;
	   }
	   	child.gameObject.GetComponent.<CubeEdgeScript>().isDownFace = false;
	}
	lowestChild.gameObject.GetComponent.<CubeEdgeScript>().isDownFace = true;
	downFace = lowestChild;
	//Debug.Log("down face is " + lowestChild);
}

function calcCollision() {
	if (downFace.gameObject.GetComponent.<CubeEdgeScript>().isColliding) {
		Debug.Log ("collide with face " + downFace.name);
		
		//change colour of tile to match colour of cube face
		cubeRend = downFace.GetComponent.<Renderer>();
		var collidingTile = downFace.GetComponent.<CubeEdgeScript>().collidingTile;
		tileRend = collidingTile.GetComponent.<Renderer>();
		tileRend.material.color = cubeRend.material.color;
	}
}

function Update ()
{
    if (!rotating)
    {
        if (Input.GetKey(KeyCode.D))
        {
            rotating = true;
            RotateCube(Vector3.right*halfCubeSize,-Vector3.forward);
        }
        else if (Input.GetKey(KeyCode.A))
        {
            rotating = true;
            RotateCube(-Vector3.right*halfCubeSize,Vector3.forward);
        }
        else if (Input.GetKey(KeyCode.W))
        {
            rotating = true;
            RotateCube(Vector3.forward*halfCubeSize,Vector3.right);
        }
        else if (Input.GetKey(KeyCode.S))
        {
            rotating = true;
            RotateCube(-Vector3.forward*halfCubeSize,-Vector3.right);
        }
    }


}



function OnCollisionEnter(collision: Collision) {
//	Debug.Log("hit collision");
}


function OnTriggerEnter(col: Collider) {
	//Debug.Log("hit trigger");
	//Debug.Log(col.name);

}