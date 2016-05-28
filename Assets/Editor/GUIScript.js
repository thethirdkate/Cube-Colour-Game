#pragma strict


@CustomEditor (TestScript)
class LevelScriptEditor extends Editor 
{
    function OnInspectorGUI()
    {   
        var myLevelScript : TestScript = target;
        
        myLevelScript.experience = EditorGUILayout.IntField("Experience", myLevelScript.experience);
        EditorGUILayout.LabelField("Level", myLevelScript.Level().ToString());
        
        
        EditorGUILayout.LabelField("Colour", myLevelScript.myColour.ToString());
        
        
    }
}