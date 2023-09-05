
class tour{

    constructor( config = {}){

        this.popupWidth = 0

        this.popupHeight = 0

        this.config = config
        
        this.last = null

        this.el = null

        this.index = 0
        
        window.addEventListener( 'beforeunload', () => {
            localStorage.setItem( 'tour', '1' )
        } )
        window.addEventListener('resize', () => {
            if( this.last )
                this.last()
        })
        document.querySelector( 'body' )
        .addEventListener( 'keyup', ( event ) => {

            if( event.key == 'ArrowRight')
                this.next()
            else if( event.key == 'ArrowLeft')
                this.prev()
        } )
    }

    setParams( popupWidth, popupHeight ){
        this.popupWidth = popupWidth
        this.popupHeight = popupHeight
    }

    getParam( index, param ){
        if( this.config[index])
            return this.config[index][param]
    }

    next(){
        let index = this.index
        index++
        index %= Object.keys( this.config ).length
        if( this.config[index] )
            this.explain( this.el, index )
    }

    prev(){
        let index = this.index
        index--
        if( index < 0 )
            index = Object.keys( this.config ).length - 1
        if( this.config[index] )
            this.explain( this.el, index )
    }

    getTourId( index ){
        let f = this.config.find( ( conf, n ) => {
            if( n == index )
                return conf
        })
        return f['tour-id']
    }

    getPosition( index ){
        if( this.config[ index ]){
            let id = this.getTourId( index ),
                el = document.querySelector( "[tour-id='" + id + "']" )
            if( el )
                return el.getBoundingClientRect()
        }
    }

    getOrientation( rect ){
        let left = false,
            right = false,
            bottom = false,
            top = false,
            screen = window.screen;

        if( screen.width < rect.x + this.popupWidth / 2)
            right = true
        else if( rect.x + rect.width < this.popupWidth / 2)
            left = true

        if( screen.height / 2 > rect.y )
            top = true
        else
            bottom = true

        return {
            left:left,
            right: right,
            bottom: bottom,
            top: top
        }
    }

    explain( el, index ){
        this.last = () => {
            let offsetX = this.getParam( index, 'left'), 
                offsetY = this.getParam( index, 'top'),
                p = this.getPosition( index ),
                hide = this.getParam( index, 'hide' ),
                show = this.getParam( index, 'show' )

            this.el = el

            this.index = index

            if( p && el ){

                let s = document.querySelector( show )
                if( s )
                    s.setAttribute('style', '')

                let h = document.querySelector( hide )
                if( h )
                    h.setAttribute('style', 'visibility:hidden;')

                let i = el.querySelector('.txt')
                if( i )
                    i.innerHTML = this.getParam( index, 'txt' ) +
                        '<br/><br/><span id="nextTour">I got it.</span>'

                let popupRect = el.getBoundingClientRect()

                document.querySelector('#nextTour')
                .addEventListener( 'click', () => {
                    this.next()
                })

                let orient = this.getOrientation( p )

                if( orient.top ){
                    el.querySelector('.top').classList.remove('hide')
                    el.querySelector('.bottom').classList.add('hide')
                }
                else if( orient.bottom ){
                    el.querySelector('.bottom').classList.remove('hide')
                    el.querySelector('.top').classList.add('hide')
                }


                el.querySelector('.top').classList
                .remove('left')

                el.querySelector('.top').classList
                .remove('right')

                el.querySelector('.bottom').classList
                .remove('left')

                el.querySelector('.bottom').classList
                .remove('right')

                if( orient.right ){

                    el.querySelector('.top').classList
                    .add('right')
                    el.querySelector('.bottom').classList
                    .add('right')
                }
                else if( orient.left ){
                    el.querySelector('.top').classList
                    .add('left')
                    el.querySelector('.bottom').classList
                    .add('right')
                }

                let left = 'left:' + (p.left + p.width / 2 + offsetX - this.popupWidth / 2 ) + 'px;',
                    top = 'top:' + (p.bottom + offsetY) + 'px;'

                if( orient.right )
                    left = 'right:0px;'

                else if( orient.left )
                    left = 'left:0px;'

                if( orient.bottom )
                    top = 'top:' + (p.top - popupRect.height - offsetY) + 'px;';

                el.setAttribute('style', top + left)
            }
        }
        this.last()
    }
}

export default{
    tour
}