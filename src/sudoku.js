class sudoku{

    constructor( tiles, autoNotes = true ){
        
        this.tiles = tiles

        this.difficulty = -1

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

        return notes.concat()
    }

    calcDifficulty( found1, found2 ){
        return Math.min( 
            Math.round( 
            ( found1 + 50 * found2 ) 
            / ( found1 + found2 )
        ), 4)
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

        if(this.pass > 0) return notes

        for( let i = 0; i < 3; i++ ){

            let nts = notes.concat()
            
            let n = this.addIndexToNotes( nts )
    
            // get all relevant notes: eg. row < 4 cell = 1 thr. 3
            let q1 = this.notesCell( n, i * 3 ),
                rq = [],
                q = [];
    
            rq = this.characteristics2( q1, 0 )
    
            if( rq.length > 0){
                let nrows = [0,1,2,3,4,5,6,7,8]
                nrows.forEach( ( nr ) => {
                    var subn = this.notesCell( notes, i * 3  )
                    subn.forEach( ( t ) => {
                        if( rq.find( ( rr ) => { return rr.row == t.row }) 
                            && t.notes.indexOf( nr ) > -1 
                            && ! rq.find( ( rn ) => { return rn.n == nr }))
                                t.notes.splice( t.notes.indexOf( nr ), 1 )
                    })
                })
            }
    
            let q2 = this.notesCell( n, i * 3 + 1 )
            
            rq = this.characteristics2( q2, 0 )
    
            if( rq.length > 0){
                let nrows = [0,1,2,3,4,5,6,7,8]
                nrows.forEach( ( nr ) => {
                    var subn = this.notesCell( notes, i * 3 + 1 )
                    subn.forEach( ( t ) => {
                        if( rq.find( ( rr ) => { return rr.row == t.row }) 
                            && t.notes.indexOf( nr ) > -1 
                            && ! rq.find( ( rn ) => { return rn.n == nr }))
                                t.notes.splice( t.notes.indexOf( nr ), 1 )
                    })
                })
            }
    
            let q3 = this.notesCell( n, i * 3 + 2 )
    
            rq = this.characteristics2( q3, 0 )
    
            if( rq.length > 0){
                let nrows = [0,1,2,3,4,5,6,7,8]
                nrows.forEach( ( nr ) => {
                    var subn = this.notesCell( notes, i * 3 + 2 )
                    subn.forEach( ( t ) => {
                        if( rq.find( ( rr ) => { return rr.row == t.row }) 
                            && t.notes.indexOf( nr ) > -1 
                            && ! rq.find( ( rn ) => { return rn.n == nr }))
                                t.notes.splice( t.notes.indexOf( nr ), 1 )
                    })
                })
            }
        }

        for( let i = 0; i < 3; i++ ){

            let nts = notes.concat()
            
            let n = this.addIndexToNotes( nts )
    
            // get all relevant notes: eg. column < 4 cell = 0 3 and 6, 1 4 7, 2 5 8
            let q1 = this.notesCell( n, i * 3 + Math.floor(i  / 3) * 3 ),
                rq = [],
                q = [];
    
            rq = this.characteristics2( q1, 1 )
    
            if( rq.length > 0){
                let ncolumns = [0,1,2,3,4,5,6,7,8]
                ncolumns.forEach( ( nr ) => {
                    var subn = this.notesCell( notes, i * 3 + Math.floor(i  / 3) * 3  )
                    subn.forEach( ( t ) => {
                        if( rq.find( ( rr ) => { return rr.column == t.column }) 
                            && t.notes.indexOf( nr ) > -1 
                            && ! rq.find( ( rn ) => { return rn.n == nr }))
                                t.notes.splice( t.notes.indexOf( nr ), 1 )
                    })
                })
            }
    
            let q2 = this.notesCell( n, i * 3 + Math.floor(i  / 3) * 3 + 1)
            
            rq = this.characteristics2( q2, 1 )
    
            if( rq.length > 0){
                let ncolumns = [0,1,2,3,4,5,6,7,8]
                ncolumns.forEach( ( nr ) => {
                    var subn = this.notesCell( notes, i * 3 + Math.floor(i  / 3) * 3 + 1)
                    subn.forEach( ( t ) => {
                        if( rq.find( ( rr ) => { return rr.column == t.column }) 
                            && t.notes.indexOf( nr ) > -1 
                            && ! rq.find( ( rn ) => { return rn.n == nr }))
                                t.notes.splice( t.notes.indexOf( nr ), 1 )
                    })
                })
            }
    
            let q3 = this.notesCell( n, i * 3 + Math.floor(i  / 3) * 3 + 2 )
    
            rq = this.characteristics2( q3, 1 )
    
            if( rq.length > 0){
                let ncolumns = [0,1,2,3,4,5,6,7,8]
                ncolumns.forEach( ( nr ) => {
                    var subn = this.notesCell( notes, i * 3 + Math.floor(i  / 3) * 3 + 2 )
                    subn.forEach( ( t ) => {
                        if( rq.find( ( rr ) => { return rr.column == t.column }) 
                            && t.notes.indexOf( nr ) > -1 
                            && ! rq.find( ( rn ) => { return rn.n == nr }))
                                t.notes.splice( t.notes.indexOf( nr ), 1 )
                    })
                })
            }
        }

        for( let i = 1; i < 10; i++ ){

            let q = this.notesCell( notes.concat(), i - 1),
                rq = this.characteristics( q );

                q = this.addIndexToNotes(q, 2, i - 1)

            if(this.found(q).length < 9)
                rq.forEach( (q) => {
                    if(q.col)
                        ;//this.removeFromCell(notes, null, q.col, i, [q.index])
                    if(q.row)
                        ;//this.removeFromCell(notes, q.row, null, i, [q.index])
                })

            q = this.notesRow( notes.concat(), i ),
            rq = this.characteristics( q );

            q = this.addIndexToNotes(q, 0, i)

            if(this.found(q).length < 9)
                rq.forEach( (q) => {
                    if(q.cell)
                        ;//this.removeFromCell(notes, q.row, null, -1 * q.cell, [q.index])
                })

            q = this.notesCol( notes.concat(), i ),
            rq = this.characteristics( q );

            q = this.addIndexToNotes(q, 1, i)

            if(this.found(q).length < 9)
                rq.forEach( (q) => {
                    if(q.cell)
                        ;//this.removeFromCell(notes, null, q.col, -1 * q.cell, [q.index])
                })

            q = this.notesCell( notes.concat(), i - 1)
            rq = []
            rq = this.threeTwoTwo(q)
            if(rq.length > 0)
                //console.log(rq)
                //this.pass = 1

            if(this.found(q).length < 9)
                rq.forEach( (q) => {
                    this.removeFromCell(notes, q.row, q.column, q.cell, q.notes)
                })
        }

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

        return notes;
    }

    isValid( ar ){
        let r = true,
            a = ar || this.notes

        a.forEach( ( a ) => {
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

    removeIndex( ){

        let row = -1,
            col = -1,
            tile = null,
            s = '',
            qq = 0

        while( qq < 81 * 2){
            row = Math.round( Math.random() * 8) + 1,
            col = Math.round( Math.random() * 8) + 1,
            tile = this.getTile( row, col ),
            s = ''

            if( typeof tile.index == 'number'){
                s = tile.index
                tile.index = ''
                if( this.makeNotes() && this.difficulty > 0)
                    break;
                else{
                    tile.index = s
                    qq++
                }
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
        this.notes = this.makeNotes()
        if( this.difficulty > level + 0.5 || this.difficulty < level){
            removed.forEach( ( r ) => {
                let tile = this.getTile( r.row, r.col )
                tile.index = r.index
            })
            this.notes = []
            ok = false
        }
        return ok
    }

    validSudoku(){
        let n = true,
            c = 0
        this.tiles.forEach( ( t ) => {
            if( typeof t.index == 'number' )
                c++
            else if( ( ! t.notes || t.notes.length != 1 ))
                n = false
            else 
                c++
        })
        return n && c == 81
    }

    generate( level = 1 ){

        console.log('start generate')
        console.time('generate')

        // Clear the previous run
        for( let m = 0; m < 9; m++ )
            this.unsetCell(m)

        // Generate a full Sudoku
        let nn = [9,8,7,6,5,4,3,2,1],
            c = 9,
            n = this.makeNotes(),
            hn = []

        while( nn.length >  0 && ! this.validSudoku() ){
            c = nn.shift()
            n = this.makeNotes()
            hn = []

            let fnd = false
            for( var cc = 0; cc < n.length; cc++ ){
                if( n[cc].notes.length == c ){
                    fnd = true
                    hn.push( n[cc] )
                }
            }
            let choice = Math.round( Math.random() * (hn.length - 1) ),
                t = null;
            this.tiles.forEach( ( tile ) => {
                if( hn[choice] && hn[choice].row == tile.row && 
                    hn[choice].column == tile.column ){
                    t = tile
                    tile.index = hn[choice].notes[Math.round( Math.random() * (hn[choice].notes.length - 1))]
                }
            }) 
            if(! this.isValid( this.makeNotes() ))
                t.index = ''
            if( ! this.validSudoku() && nn.length == 0)
                nn = [9,8,7,6,5,4,3,2,1]
        }

        // Remove a number of givens for the required difficulty
        let rTiles = [28, 26, 24, 22],
            remove = 81 - rTiles[level-1]
            
        while( ! this.makeHints( remove, level ))
        ;

        this.tiles.forEach( ( tile ) => {
            if( typeof tile.index == 'number' )
                tile.initialValue = true
        })

        console.timeEnd('generate')

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

    /*
        If there are three notes with three digits and two digits can go in two places and the third in three,
        then the third digit is the answer to the place which is not a possibility for either of the other two
     */
    threeTwoTwo( set ){
        let ret = set.concat();

        let digits = []
        ret.forEach( ( r ) => {
            r.notes.forEach( ( d ) => {
                let fnd = digits.findIndex((dd) => { if(dd.digit == d) return dd})
                if( fnd > -1 ){
                    digits[fnd].n++
                    digits[fnd].rows.push(r.row)
                    digits[fnd].columns.push(r.column)
                }
                else
                    digits.push(({digit: d, rows: [r.row], columns: [r.column],  n: 1}))
            })
        })

        let two = [],
            three = [];

        digits.forEach( ( d ) => {
            if(d.n == 2)
                two.push(d)
            else if(d.n == 3)
                three.push(d)
        })

        let ds = [],
            cand1 = [];
        if(two.length > 0) cand1 = cand1.concat(two)
        if(three.length > 0) cand1 = cand1.concat(three)
        digits.forEach( ( d ) => {
            ds.push(d.digit)
        })

        ret = set.concat();

        ds = []
        if(cand1.length == 3)
            cand1.forEach( (c) => {
                ds.push(c)
            })
/*         ret.forEach( ( r, i ) => {
            let remove = false
            r.notes.forEach( ( n ) => {
                if(ds.indexOf(n) == -1)
                    remove = true
            })
            if(remove)
                ret.splice(i, 1)
        }) */

        let places = [],
            test = [].concat(two, three)
        test.forEach( (t) => {
            t.rows.forEach( ( q, n ) => {
                let fnd = places.find((p) => { if(p.row == t.rows[n] && p.column == t.columns[n]) return p })
                if(! fnd )
                    places.push({row:t.rows[n], column:t.columns[n]})
            })
        })


        if( places.length == 3 && two.length == 2 && three.length == 1){

            let fnDigit = null,
                column = null,
                row = null;

            three.forEach( ( o1, n ) => {
                let fnd = null
                two.forEach( (tw) => {
                    if( tw.digit == o1.digit )
                        fnd = true
                })
                if(! fnd){
                    fnDigit = o1.digit
                    column = o1.columns[n]
                    row = o1.rows[n]
                }
            })

            let ret2 = []
            three.forEach( (th) => {
                if(th.digit == fnDigit){
                    th.rows.forEach( ( r, n) => {
                        let fnd = set.find( ( q ) => { if( q.row == th.rows[n] && q.column == th.columns[n] ){ return q } })
                        if(fnd){
                            let notes = fnd.notes.concat()
                            if(th.rows[n] == row && th.columns[n] == column)
                                notes.splice(notes.indexOf(fnDigit), 1)
                            else
                                notes = [fnDigit]
                            ret2.push({notes:notes, row: fnd.row, column: fnd.column, cell: fnd.cell})
                        }
                    })
                }
            })
            return ret2
        }

        return []
    }
    
    characteristics2( set, direction ){
        let n = [0,1,2,3,4,5,6,7,8],
            ret = [],
            ret2 = [];

        // Find the indexes for which the row is defined
        if( direction == 0 ){
            ret = []
            n.forEach( ( m ) => {
                let fnd = []
                set.forEach( ( s ) => {
                    if( s.notes.indexOf( m ) > -1 && fnd.indexOf( s.row ) == -1 )
                        fnd.push( s.row )
                })
                if( fnd.length == 1 )
                    ret.push({n:m, row:fnd[0]})
            })

            // Get full rows (three left?)
            n.forEach( ( m ) => {
                let q = 0
                ret.forEach( ( r ) => {
                    if( r.row == m )
                        q++ 
                })
                if( q == 3 ){
                    ret2 = ret2.concat( ret )
                }
                    
            })
        }
        else if( direction == 1 ){
            ret = []
            n.forEach( ( m ) => {
                let fnd = []
                set.forEach( ( s ) => {
                    if( s.notes.indexOf( m ) > -1 && fnd.indexOf( s.column ) == -1 )
                        fnd.push( s.column )
                })
                if( fnd.length == 1 )
                    ret.push({n:m, column:fnd[0]})
            })

            // Get full rows (three left?)
            n.forEach( ( m ) => {
                let q = 0
                ret.forEach( ( r ) => {
                    if( r.column == m )
                        q++ 
                })
                if( q == 3 ){
                    ret2 = ret2.concat( ret )
                }
                    
            })
        }

        return ret2
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
        return this.difficulty
    }

    getNotes(){
        return this.notes
    }
}

export default{
    sudoku
}