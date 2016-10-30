var rotator : Transform;
var speed = 1.0;
var rotating = false;
var halfCubeSize = 0.5;

var cubeRend: Renderer;
var tileRend: Renderer;

var newRotation: Vector3;

var cubeMoveSound : AudioClip;
var tileSuccessSound : AudioClip;
var tileFailSound : AudioClip;
var cubePickupInk : AudioClip;

public var downFace : GameObject;

private var endCubeObject : GameObject;

public var Reach : float = 1;

var tileShader : Shader;

function Start()
{
    rotator = (new GameObject("Rotator")).transform;
    calcFaceDown();
    
    tileShader = Shader.Find("Transparent/Diffuse");

    endCubeObject = GameObject.Find("EndCube");
}


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
	GetComponent.<AudioSource>().PlayOneShot(cubeMoveSound);
    transform.parent = null;
	rotating = false;
	calcFaceDown();
	calcCollision();
	//Debug.Log("done rotating");
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
	var cubeScript = downFace.gameObject.GetComponent.<CubeEdgeScript>();
	
	
	if (cubeScript.isColliding) {
	
		var stampTile : boolean = false;		
		
		var collidingTile = downFace.GetComponent.<CubeEdgeScript>().collidingTile;
		var tileScript = collidingTile.gameObject.GetComponent.<TileScript>();
		
		
		//get the renderers
		cubeRend = downFace.GetComponent.<Renderer>();
		tileRend = collidingTile.GetComponent.<Renderer>();
	
		Debug.Log ("collide with face " + downFace.name + tileScript.tileType);
		
	
		
		//colliding with a blank tile - one time stamp only
		if (tileScript.tileType == "blank" && tileScript.tileState == "inactive" && cubeScript.faceState == "active") { //change the tile to match the cube
			tileScript.tileState = "used";
			stampTile=true;
		
		}
		
		//colliding with a blank tile
		if (tileScript.tileType == "blankInfinite" && tileScript.tileState == "inactive" && cubeScript.faceState == "active") { //blank tile that can be infinitely restamped
			stampTile=true;
		
		}
		
		if (stampTile) {
			tileRend.material = cubeRend.material;
			
			var targetTile = tileScript.siblingTile;
			
			newRotation = new Vector3(collidingTile.transform.eulerAngles.x, downFace.transform.eulerAngles.y, collidingTile.transform.eulerAngles.z);
			collidingTile.transform.eulerAngles = newRotation;
			
			var tileAngle = Mathf.Round(collidingTile.transform.eulerAngles.y);
			
		
			
			//now check for success of ANGLE
			
			//reason for this method is possibility that tiles will have multiple possibilities for success - e.g. a circle
			//hence manual method
			
			var angleSuccess : boolean = false;
			var checkFor : int;
			
			if (tileAngle==0) { checkFor=0; }
			if (tileAngle==90) { checkFor=1; }
			if (tileAngle==180) { checkFor=2; }
			if (tileAngle==270) { checkFor=3; }
			
			//Debug.Log ("angle " + tileAngle + "check for " + checkFor + " answer is " + tileScript.successStates[checkFor]);
			if (tileScript.successStates[checkFor]) { angleSuccess = true; }
			
			//check for SHAPE SUCCESS
			var shapeSuccess : boolean = false;
			if (tileRend.material.mainTexture==tileScript.successShape) {
				shapeSuccess = true;
			}
			
	
			//check for COLOUR SUCCESS
			var colourSuccess : boolean = false; 
			
			var colourMatch1 = tileRend.material.color;
			var colourMatch2 = tileScript.successColour;
			
			Debug.Log(colourMatch1 + " vs " + colourMatch2);
			
			//doing it this way so the alpha channel isn't compared and messing it up
			if (colourMatch1.r == colourMatch2.r && colourMatch1.g == colourMatch2.g && colourMatch1.b == colourMatch2.b) {
				colourSuccess = true;
			}
			//Debug.Log(tileRend.material.color);
			//Debug.Log(tileScript.successColour);
			//BAD METHOD
			
			//Debug.Log(targetTile.GetComponent.<Renderer>().material.mainTexture);
		/*	var targetShape = targetTile.GetComponent.<Renderer>().material.mainTexture;
			Debug.Log("target" + targetShape);
			Debug.Log(" actual " + tileRend.material.mainTexture);
			if (tileRend.material.mainTexture == targetShape) { 
				shapeSuccess = true;
			}
		//	if (targetTile.material.mainTexture == tileRend.material.mainTexture) {
		//		shapeSuccess = true;
		//	}*/
			
			
			Debug.Log ("angle " + angleSuccess + " shape " + shapeSuccess + " colour " + colourSuccess);
			
			if (angleSuccess && shapeSuccess && colourSuccess) {
				//collidingTile.transform.position.y-=1;
				tileScript.tileState = "done";
				GetComponent.<AudioSource>().PlayOneShot(tileSuccessSound);

				//UPDATE TILE COUNTING SCRIPT on the end game cube object
				endCubeObject.GetComponent.<EndLevelScript>().addToTileCount();


			}
			
			else {
				//GetComponent.<AudioSource>().Success(GetComponent.<AudioSource>().clip);
				GetComponent.<AudioSource>().PlayOneShot(tileFailSound);


			}
			
			
		}
		
		
		//colliding with an ink tile
		if (tileScript.tileType == "ink") { //change the cube to match the tile
		
			//create a new material with the new colour, copy the texture and colour
			//otherwise all tiles that previously had this material set will also change colour
			
			var cubeRendTexture = cubeRend.material.mainTexture; //save this to copy to the new material
			
			cubeRend.material = new Material (Shader.Find(" Diffuse"));
			cubeRend.material.SetTextureScale("Tiling", new Vector2(100,0));
			cubeRend.material.mainTexture = cubeRendTexture;
			cubeRend.material.shader = tileShader;
			

			cubeRend.material.color = tileRend.material.color;
			cubeScript.faceState = "active";
			
			
			GetComponent.<AudioSource>().PlayOneShot(cubePickupInk);
		
		}
		
				
		//colliding with an ink tile
	/*	if (tileScript.tileType == "inkShape") { //change the cube to match the tile
		
			cubeRend.material = tileRend.material;
			cubeScript.faceState = "active";
		
		}*/
		
		
		
	}
}



function Update ()
{
    if (!rotating)
    {
    
      if (Input.GetKey(KeyCode.W) && isSpaceFree("forward"))
        {
        		rotating = true;
	            RotateCube(Vector3.forward*halfCubeSize,Vector3.right);
        
        }
    
        else if (Input.GetKey(KeyCode.D) && isSpaceFree("right"))
        {
	            rotating = true;
	            RotateCube(Vector3.right*halfCubeSize,-Vector3.forward);
            
        }
        else if (Input.GetKey(KeyCode.A) && isSpaceFree("left"))
        {
	            rotating = true;
	            RotateCube(-Vector3.right*halfCubeSize,Vector3.forward);
            
        }
        else if (Input.GetKey(KeyCode.S) && isSpaceFree("back"))
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

function isSpaceFree(direction: String) {

	var fwd:Vector3;
	var isSpaceFree : boolean = true;
/*
	if (direction == "forward") { fwd = transform.TransformDirection (0,0,1); }
	if (direction == "right") { fwd = transform.TransformDirection (1,0,0); }
	if (direction == "left") { fwd = transform.TransformDirection (-1,0,0); }
	if (direction == "back") { fwd = transform.TransformDirection (0,0,-1); }
	*/
	if (direction == "forward") { fwd = Vector3(0,0,1); }
	if (direction == "back") { fwd = Vector3(0,0,-1); }
	if (direction == "left") { fwd = Vector3(-1,0,0); }
	if (direction == "right") { fwd = Vector3(1,0,0); }

    var hits : RaycastHit[];

    hits = Physics.RaycastAll (transform.position, fwd, Reach);
    Debug.DrawRay(transform.position, fwd * Reach, Color.red);
     
     for(var rayIndex = 0; rayIndex < hits.Length; rayIndex++)
	 {
	 	// Do something
//	 	Debug.Log("something hit " + rayIndex);
	 	if (hits[rayIndex].transform.tag == "blocker") { isSpaceFree=false; }
	 }
	 
   /*  if (Physics.Raycast (transform.position, fwd, hit, Reach )) {
         Debug.Log(hit.transform.tag);
     }*/
    

	return isSpaceFree;

}