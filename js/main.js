class vector {

    constructor(a, b) {

        this.a = a
        this.b = b
        this.m = this.slope
        this.incept = this.intercept



    }
    get slope () {
        let a = this.a
        let b = this.b
        return (a.y - b.y) / (a.x - b.x)
    }
    get intercept () {
        let a = this.a
        let b = this.b
        return a.y + (a.y - b.y) / (a.x - b.x) * a.x
    }

}

class tacka {

    constructor(x, y) {

        this.x = x
        this.y = y
    }

    get svgTacka () {

        let tacka = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        tacka.setAttributeNS(null, 'cx', this.x)
        tacka.setAttributeNS(null, 'cy', this.y)
        tacka.setAttributeNS(null, 'r', 5)
        tacka.classList = 'tacka'

        // console.log(this.x)
        // console.log(this.y)
        // console.log(tacka)
        return tacka

    }

    get svgLabel () {
        let text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        let ofset = 9
        text.setAttributeNS(null, 'x', this.x)
        text.setAttributeNS(null, 'y', this.y - ofset)
        text.classList = 'tackeLabel'

        return text
    }


}

class kvadrat {
    constructor(c, a, rotacija = 0, ime = 'kvad', boja = bojaRND()) {
        this.ime = ime
        this.boja = boja
        this.a = a
        this.c = c
        this.alfa = rotacija
        this.temena = this.tacke
    }

    get tacke () {

        let a = this.a
        let c = this.c
        function rotate (a, alfa) {
            let cosA = Math.cos(alfa)
            let sinA = Math.sin(alfa)
            let xR = (a.x - c.x) * cosA - (a.y - c.y) * sinA + c.x
            let yR = (a.x - c.x) * sinA + (a.y - c.y) * cosA + c.y
            return new tacka(xR, yR)

        }

        let tackeList = []
        tackeList[0] = new tacka(c.x - a / 2, c.y - a / 2)
        tackeList[1] = new tacka(c.x + a / 2, c.y - a / 2)
        tackeList[2] = new tacka(c.x + a / 2, c.y + a / 2)
        tackeList[3] = new tacka(c.x - a / 2, c.y + a / 2)

        // console.log(tackeList)
        return tackeList.map(el => {

            return rotate(el, this.alfa)

        })


    }

    get svgTemena () {

        let listaObjekata = []

        this.temena.forEach((el, index) => {

            let parLabeltacka = {}

            parLabeltacka.label = el.svgLabel
            parLabeltacka.label.innerHTML = index + 1
            parLabeltacka.label.style.fill = `${this.boja}`

            parLabeltacka.tacka = el.svgTacka
            parLabeltacka.tacka.style.fill = `${this.boja}`

            // console.log(parLabeltacka)
            listaObjekata.push(parLabeltacka)

        })

        return listaObjekata
    }

    get svgStranice () {

        let d = `M ${this.temena[0].x} ${this.temena[0].y} `

        for (let i = 1; i < this.temena.length; i++) {

            d += `L ${this.temena[i].x} ${this.temena[i].y} `
        }

        d += 'Z'

        // console.log(d)


        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttributeNS(null, 'd', d)
        path.classList = 'stranice'
        path.style.stroke = this.boja
        path.style.fill = 'none'
        // path.style.fill = this.boja
        path.style.strokeWidth = 1

        return path
    }
}

let data = {

    centar: new tacka(50, 50),
    kvadratList: [],
    ugaoStep: 0,
    brojKvad: 40,
    prvaStr: 100,
    skala: 0.95
}



let artboards = document.getElementsByTagName('svg')

// console.log(artboards)


for (let i = 0; i < artboards.length; i++) {

    let smerRotacije = i % 2 === 0 ? 'CCW' : 'CW'

    let kvadratList = generisiKvadrate(data, smerRotacije)
    // console.log(kvadratList)

    kvadratList.forEach(kvad => {

        kvad.svgTemena.forEach(el => {

            // artboard.appendChild(el.label)
            // artboard.appendChild(el.tacka)

        })
        artboards[i].appendChild(kvad.svgStranice)

    })
}

function generisiKvadrate (data, smer) {
    let kvadratList = []
    let a = data.prvaStr
    let rotac = data.ugaoStep

    for (let i = 0; i < data.brojKvad; i++) {
        kvadratList.push(
            new kvadrat(
                data.centar
                , a
                , ugaoDegToRad(rotac)
                , `Kvad-${i}`
                , 'rgba(99, 16, 167, .7)'
            ))

        a *= data.skala
        smer === 'CCW' ? rotac += 3 : rotac -= 3
        // centar.x += 5
        // i < brojKvad/4 ? centar.y -= 5 : centar.y += 5
    }
    return kvadratList
}

// Funkcije

function ugaoDegToRad (ugaoStep) {
    return ugaoStep === 0 ? 0 : -Math.PI / (180 / ugaoStep)
}

function bojaRND () {
    let hex = '000000' + (Math.floor(Math.random() * 0xffffff)).toString(16)
    return '#' + hex.slice(-6)
}

//Animacije



// TweenMax.to('.stranice', 5, {ease: Back.easeInOut.config(0.5), css:{strokeDashoffset:'-150%'}})
// .yoyo(true)
// .repeat(-1)

TweenMax.to(
    '.stranice'
    , 4
    , {
        // ease: Linear.easeNone
        ease: Back.easeInOut.config(3)
        , css: { strokeWidth: '4' }
    })
    .yoyo(true)
    .repeat(-1)