class sudoku{

    constructor( tiles, autoNotes = true ){
        
        this.tiles = tiles

        this.difficulty = 0

        this.notes = []

        if( autoNotes )
            this.notes = this.makeNotes()
    }

    getTile( row, col ){
        let t =  null
        this.tiles.forEach( ( tile ) => {
            if( tile.row == row && tile.column == col){
                t = tile
            }
        })
        return t
    }
    
    getCell( cell ){
        let c = []
        this.tiles.forEach( ( tile ) => {
            if( tile.cell == cell )
                c.push( tile )
        })
        return c
    }

    getRow( row ){
        let r = []
        for( let n = 1; n < 10; n++ )
            r.push( this.getTile( row, n))
        return r
    }

    getColumn( col ){
        let c = []
        for( let n = 1; n < 10; n++ )
            c.push( this.getTile( n, col ))
        return c
    }

    makeNotes(){
        let notes = [],
            possibilities = 81 * 9,
            possibilities2 = 81 * 9 - 1,
            reduced = 1,
            level = [0,0];

        notes = this.interpretNotes1( this.gatherNotes( notes )) 

        for( ; 
            reduced > 0; 
            ){
                notes = this.interpretNotes1( notes )

                possibilities2 = this.countPossibilities( notes )

                reduced = possibilities - possibilities2

                level[0] += reduced
                if( reduced == 0 ){
                    notes =  this.interpretNotes2( notes )
                    reduced = possibilities2 - this.countPossibilities( notes )
                    level[1] += reduced
                }

                possibilities = possibilities2

        }

        if( possibilities == 0 ){
            this.difficulty = this.calcDifficulty( level[0], level[1] )
        }
        else
            this.difficulty = -1

        return notes
    }

    calcDifficulty( found1, found2 ){
        return Math.round( 
            ( found1 + 500 * found2 ) 
            / ( found1 + found2 ))
    }

    countPossibilities( notes ){
        let n = 0;
        notes.forEach( ( note ) => {
            if( note.notes.length > 1 )
                n += note.notes.length - 1
        } )
        return n
    }

    gatherNotes( notes ){
        let cells = []

        for( let n = 0; n < 9; n++ )
            cells.push( this.getCell( n ))

        cells.forEach( ( cell ) => {
            cell.forEach( ( tile ) => {
                if( typeof tile.index != 'number')
                    notes.push( { 
                        cell: tile.cell, 
                        row: tile.row, 
                        column: tile.column, 
                        notes: this.missing( cell ) 
                    })
            })
        })
        return notes
    }

    interpretNotes1( notes ){
        let rows = []

        for( let n = 1; n < 10; n++ )
            rows.push( this.getRow( n ))

        rows.forEach( ( row, r ) => {
            let have = []
            row.forEach( ( tile ) => {
                if( typeof tile.index == 'number')
                    have.push( tile.index )
            })
            notes.forEach( ( note ) => {
                have.forEach( ( h ) => {
                    if( note.row == r + 1 && note.notes.indexOf(h) > -1)
                        note.notes.splice( note.notes.indexOf(h), 1)
                })
            })
        })

        let columns = []

        for( let n = 1; n < 10; n++ )
            columns.push( this.getColumn( n ))

        columns.forEach( ( col, c ) => {
            let have = []
            col.forEach( ( tile ) => {
                if( typeof tile.index == 'number')
                    have.push( tile.index )
            })
            notes.forEach( ( note ) => {
                have.forEach( ( h ) => {
                    if( note.column == c + 1 && note.notes.indexOf(h) > -1)
                        note.notes.splice( note.notes.indexOf(h), 1)
                })
            })
        })

        // Find unique occurences of a possibility
        // and unset other possibilities in this tile

        let set = [1,2,3,4,5,6,7,8,9],
            uniq = []

        set.forEach( ( s ) => {
            let col = this.notesCol( notes, s )
            col.forEach( ( note ) => {
                note.notes.forEach( ( nn ) => {
                    if( this.unique( col, nn )){
                        uniq.push({ cell:note.cell, row:note.row, column: note.column, index: nn })
                    }
                })
            })
        })
        set.forEach( ( s ) => {
            let row = this.notesRow( notes, s )
            row.forEach( ( note ) => {
                note.notes.forEach( ( nn ) => {
                    if(this.unique( row, nn )){
                        uniq.push({ 
                            cell: note.cell,
                            row: note.row, 
                            column: note.column, 
                            index: nn 
                        })
                    }
                })
            })
        })

        uniq.forEach( ( u ) => {
            this.unsetOthers(notes, u)
        })

        // Find solved tile and update the notes of other tiles
        let fnd = this.found( notes )
        fnd.forEach( ( f ) => {
            let n = this.notesRow( notes, f.row)
            n.forEach( ( note ) => {
                if( f.column != note.column )
                    this.removeFromArray( note.notes, f.notes )
            })
            n = this.notesCol( notes, f.column)
            n.forEach( ( note ) => {
                if( f.row != note.row )
                    this.removeFromArray( note.notes, f.notes )
            })
        })

        return notes
    }

    interpretNotes2( notes ){

        // If a row or column of a cell must have the remaining 2 or 3 digits
        // considering the row or column, remove them from the possibilities
        // of the other cell tiles

        for( let i = 1; i < 10; i++ ){

            let q = this.notesCell( notes.concat(), i - 1),
                rq = this.characteristics( q );

                q = this.addIndexToNotes(q, 2, i - 1)

                if(this.found(q).length < 9)
                rq.forEach( (q) => {
                    if(q.col)
                        this.removeFromCell(notes, null, q.col, i, [q.index])
                    if(q.row)
                        this.removeFromCell(notes, q.row, null, i, [q.index])
                })

                q = this.notesRow( notes.concat(), i ),
                rq = this.characteristics( q );

                //continue

                q = this.addIndexToNotes(q, 0, i)

                if(this.found(q).length < 9)
                    rq.forEach( (q) => {
                        if(q.cell)
                            this.removeFromCell(notes, q.row, null, -1 * q.cell, [q.index])
                    })

                q = this.notesCol( notes, i ),
                rq = this.characteristics( q );

                q = this.addIndexToNotes(q, 1, i)

                if(this.found(q).length < 9)
                    rq.forEach( (q) => {
                        if(q.cell)
                            this.removeFromCell(notes, null, q.col, -1 * q.cell, [q.index])
                    })
            
            // By row
/*             let r = this.notesRow( notes, i ),
                rx = this.notTaken( this.getRow( i ) )

            if( r.length > 0 && rx.length > 0 && r.length < 4 && rx.length < 4 ){
                this.removeFromCell( 
                    this.notesCell( notes, r[0].cell ),
                    i,
                    null, 
                    null,
                    rx 
                )
            }

            // By column
            let c = this.notesCol( notes, i ),
                cx = this.notTaken( this.getColumn( i ) )

            if( c.length > 0 && cx.length > 0 && c.length < 4 && cx.length < 4 ){
                this.removeFromCell( 
                    this.notesCell( notes, c[0].cell ),
                    null,
                    i, 
                    null,
                    cx 
                )
            } */
        }

        //return notes;

/*         // If two numbers of the same cell must be in one row or column 
        // remove those from the same row / column in other cells
        for( let i = 1; i < 10; i++ ){
            let fnd = [],
                n = this.notesCell( notes, i )

            n.forEach( ( tile ) => {
                if( tile.notes.length == 2 ){
                    fnd.push( tile  )
                }
            })

            fnd = this.findIndentical( fnd )
            
            if( fnd.length == 2){
                if( fnd[0].row == fnd[1].row ){
                    let n = this.notesRow( notes, fnd[0].row)
                    n.forEach( ( note ) => {
                        if( fnd[0].column != note.column && fnd[1].column != note.column )
                            this.removeFromArray( note.notes, fnd[0].notes )
                    })
                }
                else if( fnd[0].column == fnd[1].column ){
                    let n = this.notesCol( notes, fnd[0].column)
                    n.forEach( ( note ) => {
                        if( fnd[0].row != note.row && fnd[1].row != note.row )
                            this.removeFromArray( note.notes, fnd[0].notes )
                    })
                }
            }
        }

        // If one digit must be in one row or column of one cell
        // remove this digits in this row or column in the other cells
        for( let i = 1; i < 10; i++ ){
            let n = this.notesCell( notes, i )
            for( let m = 0; m < 9; m++ ){
                let fnd = this.findDigitInNotes( n, m ),
                    r = this.allOnRow( fnd )
                    
                if( r > -1 && fnd.length > 1 ){
                    let n = this.notesRow( notes, r)
                    n.forEach( ( note ) => {
                        if( note.cell != fnd[0].cell )
                            this.removeFromArray( note.notes, [m] )
                    })
                }

                let c = this.allOnColumn( fnd )

                if( c > -1 && fnd.length > 1 ){
                    let n = this.notesCol( notes, c)
                    n.forEach( ( note ) => {
                        if( note.cell != fnd[0].cell )
                            this.removeFromArray( note.notes, [m] )
                    })
                }
            } 
        }
 */
        // If one digit has one possibility this must be the answer
        for( let i = 1; i < 10; i++ ){
            for( let m = 0; m < 9; m++){
                let n = this.notesCell( notes, i ),
                    fnd = this.findDigitInNotes( n, m )
                if( fnd.length == 1 ){
                    fnd[0].notes = [m]
                }
            }
        }

        // If there are two possibilities for a digit in a cell, 
        // try to find a match for the remaining notes
        // If there is such a match for one possibility and not
        // for the other the other possibility must be the answer
        // if both notes are not the same
/*         for( let i = 1; i < 10; i++ ){
            for( let m = 0; m < 9; m++ ){
                let n = this.notesCell( notes, i ),
                    fnd = this.findDigitInNotes( n, m ),
                    q = []

                if( this.uniqueNotes( fnd )){

                    if( fnd.length == 2 ){
                        fnd.forEach( ( f ) => {
    
                            let nt = f.notes.concat()
    
                            nt.splice( nt.indexOf( m ), 1 )
                            n.forEach( ( tile ) => {
                                if( this.identical( tile.notes, nt )
                                    && (tile.row == f.row || tile.column == f.column))
                                    q.push( f ) 
                            })
                        })
                        if( q.length == 1 ){
                            
                            let row = q[0].row,
                                column = q[0].column

                            fnd.forEach( ( fn ) => {
                                if( fn.row != row || fn.column != column ){
                                    if( fn.notes.length > 1 )
                                        fn.notes = [m]
                                }
                            })
                        }
                    }
                }
            }
        } */

        return notes;
    }

    isValid( ar ){
        let r = true

        ar.forEach( ( a ) => {
            let t = this.getTile( a.row, a.column)
            if( a.notes.length == 0 
                && typeof t.index !== 'number')
                r = false
        })
        return r
    }

    unsetCell( cell ){
        let t = this.getCell( cell )
        t.forEach( ( tile ) => {
            tile.index = ''
        })
    }

    setCell( n ){
        let cell = this.getCell( n ),
            digits = [0,1,2,3,4,5,6,7,8],
            d = [],
            t = -1,
            i = 0

        i = 0;
        let x = 0
        for( d = digits.concat(); d.length > 0 && typeof cell[i] !== 'undefined'  && x < 200; ){
            t = Math.round( Math.random() * (d.length - 1) )
            x++

            if( typeof d[t] !== 'undefined' 
                && this.isPossible( cell[i], d[t], this.makeNotes() )){
                let tile = cell[i++]
                tile.index = d[t]
                d.splice( t, 1)
            }
        }
        return x < 200
    }

    removeIndex(  ){

        let row = -1,
            col = -1,
            tile = null,
            s = ''

        while( true ){
            row = Math.round( Math.random() * 8) + 1,
            col = Math.round( Math.random() * 8) + 1,
            tile = this.getTile( row, col ),
            s = ''

            if( typeof tile.index == 'number'){
                s = tile.index
                tile.index = ''
                break;
            }
        }
        return {row:row, col:col, index: s}
    }

    makeHints( nRemove, level ){
        let removed = [],
            ok = true;

        for( let n = 0; n < nRemove; n++ ){
            removed.push(this.removeIndex())
        }
        this.makeNotes()
        if( this.difficulty == -1){
            removed.forEach( ( r ) => {
                let tile = this.getTile( r.row, r.col )
                tile.index = r.index
                ok = false
            })
        }
        return ok
    }

    generate( level = 1 ){

        // Clear the previous run
        for( let m = 0; m < 9; m++ )
            this.unsetCell(m)

        // Generate a full Sudoku
        let q = 0,
            qq = 0;

        for( let n = 0; n < 9; n++ ){
            q = 0
            while( ! this.setCell( n ) && q++ < 200)
                this.unsetCell( n );
        }

        // Remove a number of givens for the required difficulty
        let rTiles = [28, 26, 24, 22],
            remove = 81 - rTiles[level-1]
            
        while( qq++ < 200 &&  ! this.makeHints( remove, level ))
        ;

        if( qq > 198 )
            this.generate( level ) 

        this.tiles.forEach( ( tile ) => {
            if( typeof tile.index == 'number' )
                tile.initialValue = true
        })

        return this.tiles
    }

    getNote( notes, row, col ){
        let q = null
        notes.forEach( ( n ) => {
            if( n.row == row && n.column == col )
                q = n
        })
        return q
    }

    isPossible( tile, index, notes ){
        let p = this.getNote( notes, tile.row, tile.column )
        if( p.notes.indexOf( index ) > -1)
            return true
        else
            return false
    }

    addIndexToNotes( notes, dir, i ){
        let adds =  []
        this.tiles.forEach( (t) => {
            if(typeof t.index == 'number'){
                if((dir == 0 && i == t.row) || 
                    (dir == 1 && i == t.column) || 
                    (dir == 2 && i == t.cell)){
                        t.notes = [t.index]
                        adds.push(t)
                    }
            }
        })
        return notes.concat(adds)
    }

    notesCell( notes, cell ){
        let r = []
        notes.forEach( ( note ) => {
            if( note.cell == cell )
                r = r.concat(note)
        })
        return r
    }

    notesRow( notes, row ){
        let r = []
        notes.forEach( ( note ) => {
            if( note.row == row )
                r = r.concat(note)
        })
        return r
    }

    notesCol( notes, col ){
        let c = []
        notes.forEach( ( note ) => {
            if( note.column == col )
                c = c.concat(note)
        })
        return c
    }

    unsetOthers( notes, u ){
        notes.forEach( ( n ) => {
            if( n.row == u.row && n.column == u.column )
                n.notes = [u.index]
            else if( u.cell == n.cell && n.notes.indexOf( u.index ) > -1 )
                n.notes.splice( n.notes.indexOf( u.index ), 1)
            else if( u.row == n.row && n.notes.indexOf( u.index ) > -1)
                n.notes.splice(n.notes.indexOf( u.index ), 1)
            else if( u.row == n.row && n.notes.indexOf( u.index ) > -1)
                n.notes.splice(n.notes.indexOf( u.index ), 1)
        })
    }

    allOnRow( tiles ){
        let r = null

        tiles.forEach( ( set ) => {
            set.notes.forEach( ( s ) => {
                if( typeof r == 'object' )
                    r = set.row
                else if( r != set.row )
                    r = -1;
                else if( r > -1)
                    r = set.row
            })
        })

        if( typeof r == 'object' )
            return -1
        return r
    }

    allOnColumn( tiles ){
        let r = null

        tiles.forEach( ( set ) => {
            set.notes.forEach( ( s ) => {
                if( typeof r == 'object' )
                    r = set.column
                else if( r != set.column )
                    r = -1;
                else if( r > -1)
                    r = set.column
            })
        })

        if( typeof r == 'object' )
            return -1
        return r
    }

    findDigitInNotes( tiles, number ){
        let fnd = []
        tiles.forEach( ( t ) => {
            if( t.notes.indexOf( number ) > -1 )
                fnd.push( t )
        })
        return fnd
    }

    findIndentical( ar ){
        let fnd = []
        ar.forEach( ( a1, n ) => {
            ar.forEach( ( a2, m ) => {
                if( this.identical( a1.notes, a2.notes ) 
                    && m < n
                    && ! this.contains( fnd, a1 )
                    ){
                    fnd.push( a1 )
                    fnd.push( a2 )
                }
            })
        })
        return fnd
    }

    contains( ar, tile ){
        let fnd = ar.find( ( t ) => {
            if( t.row == tile.row && t.column == tile.column )
                return t
        })
        return typeof fnd != 'undefined'
    }

    found( notes ){
        let fnd = []
        notes.forEach( ( note ) => {
            if( note.notes.length == 1 )
                fnd.push( note)
        })
        return fnd
    }

    found2( notes ){
        let fnd = []
        notes.forEach( ( note ) => {
            //if( note.notes.length == 1 )
                fnd.push( note.notes )
        })
        return fnd
    }

    missing( tiles ){
        let missing = [0,1,2,3,4,5,6,7,8]
        tiles.forEach( ( tile ) => {
            if( typeof tile.index == 'number')
                missing.splice( missing.indexOf( tile.index ), 1)
        } )
        return missing
    }

    occurences( set, index ){
        let n = 0;
        set.forEach( ( s ) => {
            s.notes.forEach( ( ss ) => {
                if( ss === index )
                    n++
            })
        })
        return n
    }

    identical( set1, set2 ){
        let cmp = []
        set1.forEach( ( n ) => {
            cmp.push( n )
        })
        set2.forEach( ( n ) => {
            if( cmp.indexOf( n ) > -1 )
                cmp.splice( cmp.indexOf( n ), 1 )
            else
                cmp.push(null)
        })
        return cmp.length === 0
    }

    characteristics( set ){
        let n = [0,1,2,3,4,5,6,7,8],
            ret = []

        n.forEach( (n) => {
            let r = [], c = [], q = [] 
            set.forEach((s) => {
                s.notes.forEach( (note) => {
                    if(r.indexOf(s.row ) == -1 && note == n)
                        r.push(s.row )
                    if(c.indexOf(s.column ) == -1 && note == n)
                        c.push(s.column)
                    if(q.indexOf(s.cell) == -1 && note == n)
                        q.push(s.cell + 1)
                })
            })
            if(r.length == 1)
                ret.push({index: n, row: r[0]})
            if(c.length == 1)
                ret.push({index: n, col: c[0]})
            if(q.length == 1)
                ret.push({index: n, cell: q[0]})
        })
        return ret
    }

    notTaken( set ){
        let n = [0,1,2,3,4,5,6,7,8]
        set.forEach( ( s ) => {
            if( typeof s.index == 'number')
               n.splice( n.indexOf( s.index ), 1 )
        })
        return n
    }

    removeFromCell( tiles, row, col, cell, possibilities ){
        tiles.forEach( ( tile ) => {
            if( typeof row == 'number' ){
                if(typeof cell == 'number'){
                    if(cell > 0){
                        if(tile.cell != cell - 1 && tile.row == row)
                            this.removeFromArray(tile.notes, possibilities)
                    }
                    else{
                        if(tile.cell == (-1 * cell) - 1 && tile.row != row)
                            this.removeFromArray(tile.notes, possibilities)
                    }
                }
                else if( tile.row != row  ){
                    this.removeFromArray( tile.notes, possibilities )
                }
            }
            else if( typeof col == 'number' ){
                if(typeof cell == 'number'){
                    if(cell > 0){
                        if(tile.cell != cell - 1 && tile.column == col)
                            this.removeFromArray(tile.notes, possibilities)
                    }
                    else{
                        if(tile.cell == (-1 * cell) - 1 && tile.column != col)
                            this.removeFromArray(tile.notes, possibilities)
                    }
                }
                else if( tile.column != col){
                    this.removeFromArray( tile.notes, possibilities )
                }
            }
        })
    }

    removeFromArray( notes, remove ){
        remove.forEach( ( p ) => {
            if( notes.indexOf( p ) > -1 )
                notes.splice( notes.indexOf( p ), 1 )
        })
    }

    unique( set, index ){
        return this.occurences( set, index ) === 1
    }

    uniqueNotes( tiles ){
        let q = true
        tiles.forEach( ( tile, m ) => {
            tiles.forEach( ( t, o ) => {
                if( o < m )
                    if( this.identical( tile.notes, t.notes ))
                        q = false
            })
        })
        return q
    }

    getDifficulty(){
        if( this.isValid( this.notes ))
            return this.difficulty
        else
            return -1
    }

    getNotes(){
        return this.notes
    }
}

export default{
    sudoku
}