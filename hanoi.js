var stage = {};

$(document).ready(function() {
    stage.setDimensions(5).setDiscs(stage.randomColor()).enterDiscs();
    hanoi(stage.numOfDiscs, 'src', 'aux', 'dst');
    stage.moveDiscs();
})

stage.moves = [];
stage.discs = [];

// for recording discs moving from platform to platform
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

// setting the dimensions of each disc
stage.setDimensions = function (numOfDiscs) {
    this.numOfDiscs = numOfDiscs;

    var dimensions = {
        min: 100,
        max: 250
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
            number: (i + 1),
            el:     $('<div class="disc" id="' + (i + 1) + '" style="bottom: 800px;">' + innerEl + '</div>')
        }

        // add to discs
        stage.discs.push(disc);
        stage.platforms[0].discs.push(disc);
    }
    return this;
}

// enter discs to src platform
stage.enterDiscs = function () {
    var discs = this.discs.slice().reverse();
    
    for (var i = 0; i < this.numOfDiscs; i++) {
        $('#stage').append(this.discs[i].el);

        var that = this;
        // have to wrap in an IIFE to retain value of i
        (function(i){ setTimeout(function() {
                var bottom = (70 + (i * 40)).toString() + 'px';
                // drop and fade discs in
                that.discs[Math.abs(i - that.numOfDiscs + 1)].el.css({bottom: bottom, opacity: 1})
            }, i * 100)
        })(i);
    }
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

// the hanoi function
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

