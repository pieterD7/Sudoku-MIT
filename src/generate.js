import sudoku from './sudoku.js'

addEventListener( 'message', ( msg ) => {
    let ok = false
    while( ! ok ){
        let s = new sudoku.sudoku( JSON.parse(msg.data.tiles) ),
            tiles = s.generate(msg.data.d),
            notes = s.getNotes(),
            d = s.getDifficulty()
        
        if( d > 0 ){
            ok = true
            postMessage({
                tiles, 
                notes, 
                d
            })
        }
        else s = null
    }
})