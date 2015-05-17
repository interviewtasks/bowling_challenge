/*
 Bowling Challenge
 ·       Please create a repository in GitHub (or similar) so that we can follow your progress.
 ·       Please use plain JavaScript
 ·       Please note that it does not need to be feature-complete, we are more curious about the way you approach solving problems.

 Implement a scoring system for a bowling game:
 ·       A game consists of 10 frames.
 ·       In general each frame has 2 rolls.
 ·       In general a player scores the number of pins knocked down.
 ·       If the player knocks down all 10 pins on the first roll it’s a strike. The player scores 10 plus the number of pins knocked down in the next two rolls.
 ·       If the player knocks down all 10 pins in two rolls it’s a spare. The player scores 10 plus the number of pins knocked down in the next roll.
 ·       Optional: The player gets additional rolls in the last frame:
            - one additional for a spare after the second roll or
            - two extra rolls for a strike.
 ·       Visualize the scoring of the game.
 ·       Create a method that randomly throws a roll (one roll is 1-10 pins knocked down), and progresses the scoring.
 */

var d = document;

var Roll = function(){
    var max = 10;
    var min = 1;

    this.takeARoll = function(){
        this.roll = (Math.random() * (max) | 0) + min;
    };
};

var Frame = function(){
    var rolls = [];
    var maxOfRolls = 2;

    this.createANewRoll = function(){
        if (rolls.length < maxOfRolls) rolls.push(new Roll());
        else throw new Error('Number of rolls exceeded');
    };
};

var Game = function(){
    var frames = [];
    var maxOfFrames = 10;

    var createAFrame = function(){
        if (frames.length < maxOfFrames) frames.push(new Frame());
        else throw new Error('Number of frames exceeded');
    };

    var fillFrames = function(){
        var i;
        for (i = 0; i < maxOfFrames; i++) {
            createAFrame();
        }
    };

    this.play = function(){
        fillFrames();
    };
};

var game = new Game();



