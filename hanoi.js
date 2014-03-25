var stage = {};

$(document).ready(function() {
    // setup by creating discs, entering them into the DOM, and setting mouse events
    stage.setDimensions(10).setDiscs('#EDEDED').enterDiscs().hover().select();
})

stage.moves = [];
stage.discs = [];

stage.platforms = [
    {
        name: 'src',
        discs: [],
        position: 0
    },
    {
        name: 'dst',
        discs: [],
        position: 400
    },
    {
        name: 'aux',
        discs: [],
        position: 800
    }
];

// sets discs
stage.set = function (discs) {
    this.discs = discs;
    this.platforms[0].discs = discs;
}

// setting the dimensions of each disc
stage.setDimensions = function (numOfDiscs) {
    this.numOfDiscs = numOfDiscs;

    var dimensions = {
        min: 75,
        max: 275
    }

    var range = dimensions.max - dimensions.min;
    var change = Math.round(range/(this.numOfDiscs - 1));

    this.dimensions = [];

    for (var i = 0; i < this.numOfDiscs; i++) {
        this.dimensions.push(dimensions.min + i*change);
    }

    return this;
}

// creating the disc element
stage.setDiscs = function (color) {

    for (var i = 0; i < stage.numOfDiscs; i++) {
        // innerEl for centering purposes
        color = colorLuminance(color, -.1)
        var innerEl = '<div class="innerDisc" style="width: ' + this.dimensions[i] + 'px; background-color: ' + color + '"></div>';
        var disc = {
            color: color,
            innerEl: innerEl,
            el: $('<div class="disc" style="bottom: 800px;">' + innerEl + '</div>')
        }

        // add to discs
        stage.discs.push(disc);
        stage.platforms[0].discs.push(disc);
    }
    return this;
}

// enter discs to src platform
stage.enterDiscs = function () {
    
    for (var i = 0; i < this.numOfDiscs; i++) {
        $('#stage').append(this.discs[i].el);

        var that = this;
        // have to wrap in an IIFE to retain value of i
        (function(i){ setTimeout(function() {
                var bottom = (70 + (i * 40)).toString() + 'px';
                // drop and fade discs in
                that.discs[Math.abs(i - that.numOfDiscs + 1)].el.css({bottom: bottom, opacity: .8})
            }, i * 100)
        })(i);
    }
    return this;
}

// move discs with setTimeout
stage.moveDiscs = function () {
    var map = {src: 0, dst: 1, aux: 2}
    var that = this;

    setTimeout(function () {
        that.moves.forEach(function(move, index) {
            var srcIndex = map[move.src];
            var dstIndex = map[move.dst];
            var src = that.platforms[srcIndex];
            var dst = that.platforms[dstIndex];

            (function (index) {
                setTimeout(function () {
                    var disc = src.discs.shift(0, 1);
                    that.moveIt(disc, src, dst);
                    dst.discs.unshift(disc);

                }, (index + 1) * 500)
            }(index));

        });
    }, 1000)
}

// move individual disc
stage.moveIt = function (disc, src, dst) {
    var bottom = (70 + dst.discs.length * 40).toString() + 'px';
    var left = dst.position.toString() + 'px';

    disc.el.css({
        bottom: bottom,
        left: left
    })
}

// to generate random hex value
stage.randomColor = function () {
    var color = '#', index;
    var values = '1234567890abcdef'.split('');

    for (var i = 0; i < 6; i++) {
        index = Math.floor(Math.random() * 16);
        color += values[index];
    }

    return color;
}

// hover over disc selects
stage.hover = function () {
    var discs = this.discs.slice();

    discs.forEach(function(disc, index) {
        disc.el.children().on('mouseover', function() {

            returnColor(index);

            for (var i = discs.length - 1; i > index - 1; i--) {
                discs[i].el.children().css('background-color', colorLuminance(discs[i].color, -.25))
            }

        }).on('mouseout', function() {
            returnColor(index);
        })
    })

    function returnColor (index) {
        for (var i = 0; i < discs.length; i++) {
            discs[i].el.children().css('background-color', discs[i].color)
        }
    }

    return this;
}

// removes unwanted discs from puzzle
stage.realizeSelection = function (index) {
    var color = this.randomColor();
    var discs = this.discs;

    // looping over discs
    for (var i = 0; i < discs.length; i++) {
        // remove evens from discs
        discs[i].el.off('click').children().off('mouseover').off('mouseout');

        if (i < index) {
            discs[i].el.css('opacity', 0);
            // waiting for the opacity transition before removing the discs from DOM
            (function (i) { setTimeout(function() {
                    discs[i].el.remove();
                }, 400)
            }(i));
        } else {
            // changing the color of the discs we want in the puzzle
            color = colorLuminance(color, -.15);
            discs[i].el.css('opacity', 1).children().css('background-color', color);
        }
    }

    // returning the discs we want in the puzzle
    return discs.slice(index);
}

// when a disc is clicked, begin the hanoi puzzle
stage.select = function () {
    var that = this;
    this.discs.forEach(function(disc, index) {
        disc.el.on('click', function() {
            // setting the puzzle according the discs selected
            that.set(that.realizeSelection(index));
            // runnig the hanoi function to get the moves for the puzzle
            hanoi(that.discs.length, 'src', 'aux', 'dst');
            // cyclining through the moves
            that.moveDiscs();
        })
    })
}

// the hanoi function from Douglas Crockford's JavaScript: The Good Parts
var hanoi = function (disc, src, aux, dst) {

    if (disc > 0) {
        hanoi(disc - 1, src, dst, aux);
        // console.log('Move disc ' + disc + ' from ' + src + ' to ' + dst);
        stage.moves.push({ src: src, dst: dst })
        hanoi(disc - 1, aux, src, dst);
    }
}

// curtosy of Craig Buckler: http://www.sitepoint.com/javascript-generate-lighter-darker-color/
function colorLuminance(hex, lum) {

    // validate hex string
    var hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    var lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
    }

    return rgb;
}
