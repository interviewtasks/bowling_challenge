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

var SimulatedRoll = function(max){
    var min = 1;

    this.takeARoll = function(){
        this.roll = (Math.random() * max | 0) + min;
		console.log('takeARoll', this.roll);
		return this.roll;
    };

    this.getRoll = function(){
        return this.roll;
    };
};

var SimulatedRollFactory = function() {
    this.createInstance = function(max){
        return new SimulatedRoll(max);
    };
};

var Frame = function(rollFactoryObj){
    var rolls = [], maxOfRolls = 2, maxPoints = 10, points = 0, spare, strike;

    var createNewRoll = function(max){
        return rollFactoryObj.createInstance(max);
    };

    this.addNewRoll = function(newRollObj){
        rolls.push(newRollObj);
        return newRollObj;
    };

    var isStrike = function (val){
        strike = (maxPoints === val);
        return strike;
    };

    var isSpare = function(){
        spare = (maxPoints === points);
        return spare;
    };

    var addStats = function(val){
        points += val;
    };

    this.makeRolls = function(){
        var rollPoints;
        for (var i = 0; i < maxOfRolls; i++) {
            var newRollObj = this.addNewRoll(createNewRoll(maxPoints - points));
            rollPoints = newRollObj.takeARoll();
            addStats(rollPoints);
            if (isStrike(rollPoints)) return rolls;
            isSpare();
        }
        this.rolls = rolls;
        return rolls;
    };

    this.makeExtraRolls = function(numberOfRolls){
        for (var i = 0; i < numberOfRolls; i++) {
            var newRollObj = this.addNewRoll(createNewRoll(maxPoints));
            rollPoints = newRollObj.takeARoll();
            addStats(rollPoints);
        }
    };

    this.getPoints = function(){
        return points;
    };

    this.getPointsByIndex = function(index){
        return rolls[index].roll;
    };

    this.getStrike = function(){
        return strike;
    };

    this.getSpare = function(){
        return spare;
    };

    this.setStrike = function(val){
        strike = val;
    };

    this.getRolls = function(){
        return rolls;
    };
};

var Game = function(){
    var frames = [], maxOfFrames = 10, score = 0, frameScores = [];

    var createFrame = function(rollFactoryObj){
        if (frames.length < maxOfFrames) {
            return new Frame(rollFactoryObj);
        } else throw new Error('Number of frames exceeded');
    };

    var addFrame = function(frameObj) {
        frames.push(frameObj);
        return frameObj;
    };

    var fillFrames = function(rollFactoryObj){
        var i;
        var rollNumber = 0;
        for (i = 0; i < maxOfFrames; i++) {
            var newFrame = addFrame(createFrame(rollFactoryObj));
            var newFrameRolls = newFrame.makeRolls();
            if (i === (maxOfFrames - 1)) {
                if (newFrame.getStrike()) newFrame.makeExtraRolls(2);
                else if (newFrame.getSpare()) newFrame.makeExtraRolls(1);
            }
            calcScores(frames)
            console.log(newFrame.getRolls());
            //console.log('fillFrames', i, calcScores(frames), frameScores);
        }
        calcScores(frames)
        console.log(frames);
        console.log(score);
    };

    this.play = function(rollFactoryObj){
        fillFrames(rollFactoryObj);
    };

    this.getFrames = function(){
        return frames;
    };

    var calcScores = function(frames){
        var scoresUpToExclude = frameScores.length, score;
        try {
            score = calcFrameScore(new FramesRollsIterator(frames), scoresUpToExclude);
            frameScores.push(score);
            console.log(frameScores);
        } catch (err) {
            if (err instanceof NoElements) {
                console.log(err, scoresUpToExclude);
                return;
            }
            throw err;
        }
    };


    var calcFrameScore = function(FramesRollsIterator, scoresUpToExclude){
        while (FramesRollsIterator.hasNext()) {
            var currentRoll = FramesRollsIterator.next();
            if (currentRoll.frameNr === scoresUpToExclude) {
				console.log('currentRoll', currentRoll);
                var score, nextSet1, nextSet2;
                if (currentRoll.frame.getStrike() || currentRoll.frame.getSpare()) {
                    nextSet1 = FramesRollsIterator.next();
                    nextSet2 = FramesRollsIterator.next();
                    score = currentRoll.roll.getRoll() + nextSet1.roll.getRoll() + nextSet2.roll.getRoll();
                } else {
                    nextSet1 = FramesRollsIterator.next();
                    score = currentRoll.roll.getRoll() + nextSet1.roll.getRoll();
					console.log(score)
                }
				console.log(currentRoll.frameNr, score)
                return score;
            }
        }
		throw new NoElements();
    };
};

var FramesRollsIterator = function(frames){
    var iterData = [], max = frames.length, i, iterPointer = 0;
    for (i = 0; i< max; i++) {
        var frame = frames[i];
        var rolls = frame.getRolls();
        rolls.forEach(function(roll){
            this.push([{'frameNr': i, 'frame': frame, 'roll': roll}]);
        }, iterData);
    }
    this.next = function(){
        if (this.hasNext()) {
            return iterData[iterPointer++][0];
        }
        throw new NoElements(); //exception
    };

    this.hasNext = function(){
        return (iterData.length > iterPointer);
    };
};

var NoElements = function(){
    this.name = 'NoElements';
    this.message = 'No Elements';
};

var View = function(){
    var results = [];

    var createRollFactoryInstance = function(){
        return new SimulatedRollFactory();
    };

    this.initGame = function(){
        var rollFactoryObj = createRollFactoryInstance();
        var game = new Game();
        game.play(rollFactoryObj);
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

var view = new View();
view.initGame();
