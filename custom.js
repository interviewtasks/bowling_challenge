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

//var d = document;

var Roll = function(max){
    var min = 1;

    this.takeARoll = function(){
        this.roll = (Math.random() * (max) | 0) + min;
    };
};

var Frame = function(){
    var rolls = [];
    var maxOfRolls = 2;
    var maxPoints = 10;
    var points = 0;

    var createANewRoll = function(max){
        if (rolls.length < maxOfRolls) rolls.push(new Roll(max));
        else throw new Error('Number of rolls exceeded');
    };

    var isAStrike = function (){
        this.strike = (maxPoints === rolls[0].roll);
    };

    var isASpare = function(){
        this.spare = (maxPoints === (rolls[0].roll + rolls[1].roll));
    };

    var roll = function(index){
        rolls[index].takeARoll();
        points += rolls[index].roll;
    };

    this.makeRolls = function(){
        var max = maxPoints;
        for (var i = 0; i < maxOfRolls; i++) {
            if (max) {
                createANewRoll(max);
                roll(i);
                max -= rolls[i].roll;
                if (i === 0) isAStrike();
                else isASpare();
            }
        }
    };

    this.getPoints = function(){
        return points;
    };

    this.getPointsByIndex = function(index){
        return rolls[index].roll;
    };
};

var Game = function(){
    var frames = [];
    var maxOfFrames = 10;
    var score = 0;

    var createAFrame = function(){
        if (frames.length < maxOfFrames) frames.push(new Frame());
        else throw new Error('Number of frames exceeded');
    };

    var fillFrames = function(){
        var i;
        var rollNumber = 0;
        var additionalPoints = [];
        for (i = 0; i < maxOfFrames; i++) {
            createAFrame();
            frames[i].makeRolls();
            rollNumber += 1;
            frames[i].result = frames[i].getPoints();
            additionalPoints[rollNumber] = [[frames[i].getPoints(), i]];
            score += frames[i].getPoints();
            if (frames[i].strike) {
                additionalPoints[rollNumber + 1] = additionalPoints[rollNumber + 1] || [[]];
                additionalPoints[rollNumber + 1].push(rollNumber);
                additionalPoints[rollNumber + 2] = additionalPoints[rollNumber + 2] || [[]];
                additionalPoints[rollNumber + 2].push(rollNumber);
            } else if (frames[i].spare){
                additionalPoints[rollNumber + 1] = additionalPoints[rollNumber + 1] || [[]];
                additionalPoints[rollNumber + 1].push(rollNumber);
            }
            var max = additionalPoints[rollNumber].length;
            if (max > 1) {
                var apElement = additionalPoints[rollNumber];
                for (var j = 1; j < max; max++) {
                    var apInd = apElement[j];
                    frames[apElement[0][1]].result += additionalPoints[apInd][0][0];
                }
            }
        }
        console.log(frames);
    };

    this.play = function(){
        fillFrames();
    };

    this.getFrames = function(){
        return frames;
    };
};

var View = function(){
    var results = [];
    var initGame = function(){
        var game = new Game();
        game.play();
        results = game.getFrames();
    };

    var createResultsTable = function(){
        var body = d.body;
        var thead = d.createElement('thead');
        var tfoot = d.createElement('tfoot');
        var table = d.createElement('table');
        var tbody = d.createElement('tbody');
        var max = results.length;
        for (var i = 0; i < max; i++) {
            var tr = d.createElement('tr');
            var td = d.createElement('td');
            var text = d.createTextNode(i+1);
            td.appendChild(text);
            var frame = results[i];
        }
    }
};
