var gameObj = {
    points: {
        score: 0,
        history: [],
        status: 1
    },
    stage: [],
    initStage: function () {
        for (var i = 0; i < 4; i++) {
            this.stage[i] = [];
            for (var j = 0; j < 4; j++) {
                this.stage[i][j] = {
                    boxObj: null,
                    position: [i, j]
                };
            }
        }
    },
    
    empty: function () {
        var emptyList = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.stage[i][j].boxObj === null) {
                    emptyList.push(this.stage[i][j]);
                }
            }
        }
        return emptyList;
    },

    newBox: function () {
        var _this = this;

        var box = function (obj) {
            var num = Math.random() > 0.9 ? 4 : 2;
            this.value = num;
            this.parent = obj;
            this.domObj = document.createElement('span');
            this.domObj.innerText = num;
            this.domObj.className = 'row' + obj.position[0] + ' ' + 'cell' + obj.position[1] + ' ' + 'num' + num;
            document.getElementById('stage').appendChild(this.domObj);
            obj.boxObj = this;
        }

        var emptyList = this.empty();
        if (emptyList.length) {
            var randomIndex = Math.floor(Math.random() * emptyList.length);
            new box(emptyList[randomIndex]);
            return true;
        }
    },

    isEnd: function () {
        var emptyList = this.empty();
        if (!emptyList.length) {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    var obj = this.stage[i][j];
                    var adjacent = [
                        (j > 0) ? this.stage[i][j - 1] : null, // Left
                        (i > 0) ? this.stage[i - 1][j] : null, // Up
                        (j < 3) ? this.stage[i][j + 1] : null, // Right
                        (i < 3) ? this.stage[i + 1][j] : null  // Down
                    ];

                    for (var k = 0; k < adjacent.length; k++) {
                        if (adjacent[k] && obj.boxObj.value === adjacent[k].boxObj.value) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
        return false;
    },

    gameOver: function () {
        alert('GAME OVER!');
    },

    moveTo: function (obj1, obj2) {
        obj2.boxObj = obj1.boxObj;
        obj2.boxObj.domObj.className = 'row' + obj2.position[0] + ' ' + 'cell' + obj2.position[1] + ' ' + 'num' + obj2.boxObj.value;
        obj1.boxObj = null;
    },

    addTo: function (obj1, obj2) {
        obj2.boxObj.domObj.parentNode.removeChild(obj2.boxObj.domObj);
        obj2.boxObj = obj1.boxObj;
        obj1.boxObj = null;
        obj2.boxObj.value *= 2;
        obj2.boxObj.domObj.className = 'row' + obj2.position[0] + ' ' + 'cell' + obj2.position[1] + ' ' + 'num' + obj2.boxObj.value;
        obj2.boxObj.domObj.innerText = obj2.boxObj.value;
        this.points.score += obj2.boxObj.value;
        document.getElementById('score').innerText = this.points.score;
        return obj2.boxObj.value;
    },

    clear: function (x, y) {
        var can = false;
        for (var i = 0; i < 4; i++) {
            var fstEmpty = null;
            for (var j = 0; j < 4; j++) {
                var objInThisWay = this.getObjInDirection(x, y, i, j);
                if (objInThisWay.boxObj !== null) {
                    if (fstEmpty) {
                        this.moveTo(objInThisWay, fstEmpty);
                        fstEmpty = null;
                        j = 0;
                        can = true;
                    }
                } else if (!fstEmpty) {
                    fstEmpty = objInThisWay;
                }
            }
        }
        return can;
    },

    getObjInDirection: function (x, y, i, j) {
        switch ("" + x + y) {
            case '00': return this.stage[i][j];
            case '10': return this.stage[j][i];
            case '11': return this.stage[3 - j][i];
            case '01': return this.stage[i][3 - j];
        }
    },

    move: function (x, y) {
        var can = this.clear(x, y) ? 1 : 0;
        var add = 0;

        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                var objInThisWay = this.getObjInDirection(x, y, i, j);
                var objInThisWay2 = this.getObjInDirection(x, y, i, j + 1);

                if (objInThisWay2.boxObj && objInThisWay.boxObj.value === objInThisWay2.boxObj.value) {
                    add += this.addTo(objInThisWay2, objInThisWay);
                    this.clear(x, y);
                    can = 1;
                }
            }
        }

        if (add) {
            var addscore = document.getElementById('addScore');
            addscore.innerText = "+" + add;
            addscore.className = "show";
            setTimeout(function () {
                addscore.className = "hide";
            }, 500);
        }

        if (can) {
            this.newBox();
        }

        if (this.isEnd()) {
            this.gameOver();
        }
    },

    init: null
};

var controller = function () {
    var startX = 0;
    var startY = 0;
    var ready = 0;

    this.start = function (x, y) {
        ready = 1;
        startX = x;
        startY = y;
    };

    this.move = function (x, y) {
        if (x - startX > 100 && ready) {
            gameObj.move(0, 1);
            ready = 0;
        } else if (startX - x > 100 && ready) {
            gameObj.move(0, 0);
            ready = 0;
        }
        else if (startY - y > 100 && ready) {
            gameObj.move(1, 0);
            ready = 0;
        }
        else if (y - startY > 100 && ready) {
            gameObj.move(1, 1);
            ready = 0;
        }
    };

    this.end = function (x, y) {
        ready = 0;
    };

    return {
        start: this.start,
        move: this.move,
        end: this.end
    };
}();

function disableSelection(target) {
    if (typeof target.onselectstart !== "undefined") // IE route
        target.onselectstart = function () { return false; }
    else if (typeof target.style.MozUserSelect !== "undefined") // Firefox route
        target.style.MozUserSelect = "none";
    else // Other route (e.g. Opera)
        target.onmousedown = function () { return false; }
    target.style.cursor = "default";
}

window.onload = function () {
    gameObj.initStage();
    gameObj.newBox();

    var stage = document.getElementById('stage');
    document.onmousedown = function (e) {
        var event = e || window.event;
        controller.start(event.clientX, event.clientY);
    };
    document.onmousemove = function (e) {
        var event = e || window.event;
        controller.move(event.clientX, event.clientY);
    };
    document.onmouseup = function (e) {
        controller.end(e.clientX, e.clientY);
    };

    function keyUp(e) {
        var currKey = e.keyCode || e.which || e.charCode;
        switch (currKey) {
            case 37: gameObj.move(0, 0); break;
            case 38: gameObj.move(1, 0); break;
            case 39: gameObj.move(0, 1); break;
            case 40: gameObj.move(1, 1); break;
        }
    }
    document.onkeyup = keyUp;
};
