/*
    Manage the game states and transitions uing the State Design Pattern.

    Main Menu --> Play Level --> Level Recap (Ads?)
          ^                          /
           \________________________/

*/

// TODO create a click handler that outsources to gameState.state.handleClick

var gameState = function() {
    this.levelNum = 0;
    this.state = mainMenu; 
    this.animate = this.state.animate;
    this.transition = function() {
        this.state = this.state.nextState();
    }
}


var mainMenu = function() {
    this.animate = function() {
        // 1) Draw text for options
        // 1.a) Play level
    }

    this.handleClick = function() {

    }

    this.nextState = function() {
        gameState.levelNum++; 
        var nextLevel = new GameLevel(gameState.level);
        return nextLevel;
    }
}
