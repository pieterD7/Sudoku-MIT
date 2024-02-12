import sudoku from './sudoku.js'

addEventListener( 'message', ( msg ) => {
    let s = new sudoku.sudoku( msg.data.tiles )
    console.log(s.getDifficulty())
    postMessage({tiles: s.generate(msg.data.d), d: s.getDifficulty()})
})