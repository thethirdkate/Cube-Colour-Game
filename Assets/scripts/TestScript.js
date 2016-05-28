#pragma strict

var experience : int;


public enum colourList
{
    Protagonists    = 9,
    Antagonists     = 10,
    HeadsUpDisplay  = 11,
    LevelBoundaries = 13
}

public var myColour : colourList; 
    
    

function Level() : int
{
    return experience / 750; 
}