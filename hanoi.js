var stage = {};

stage.discs = 3;

stage.poles = [
    {
        name: 'src',
        discs: []
    },    
    {
        name: 'dst',
        discs: []
    },    
    {
        name: 'aux',
        discs: []
    }
];

stage.moves = [];

stage.setDiscs = function () {
    for (var i = 0; i < stage.discs; i++) {
        var disc = '<p class="' + (i + 1) + '">' + (i + 1) + '</p>'
        stage.poles[0].discs.push(disc);
    }
}

stage.moveDiscs = function () {
    var map = {src: 0, dst: 1, aux: 2}

    this.moves.forEach(function(move) {
        var srcIndex = map[move.src];
        var dstIndex = map[move.dst];

        var disc = this.poles[srcIndex].discs.shift(0, 1);
        this.poles[dstIndex].discs.unshift(disc);

    }.bind(this));
}

var hanoi = function (disc, src, aux, dst) {

    if (disc > 0) {
        hanoi(disc - 1, src, dst, aux);
        // console.log('Move disc ' + disc + ' from ' + src + ' to ' + dst);
        stage.moves.push({ src: src, dst: dst })
        hanoi(disc - 1, aux, src, dst);
    }
}


stage.setDiscs();
hanoi(stage.discs, 'src', 'aux', 'dst');
stage.moveDiscs();

