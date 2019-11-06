var colors
var baseColor
var minMaxLevel = 3
var maxMaxLevel = 5
var maxLevel
var minSize = 400
var maxSize = 490
var minSegmentOffset = 0.4
var minSplitChance = 0.2
var maxSplitChance = 0.8
var minStrokeWeight = 2
var maxStrokeWeight = 8
var funkyDiagonalSplitChance = 0.3
var maxRatio = 1.8
var id = 0
var counter = 0
var allSegments = []

class Mondriaan {
    segment;

    constructor(width, height){
        // Math.seedrandom("1234")
        this.width = width
        this.height = height
        this.reset()
    }

    draw(){
        stroke(0)
        strokeWeight(this.strokeWeight)
        if(counter < allSegments.length){
            allSegments[counter].draw()
        }
        counter++
        if(counter > allSegments.length + 20){
            this.reset()
        }
    }

    reset(){
        counter = 0
        id = 0
        allSegments = []
        this.strokeWeight = minStrokeWeight + Math.random() * (maxStrokeWeight - minStrokeWeight)
        this.generate()
    }

    generate(){
        clear()
        maxLevel = Math.ceil(Math.random() * (maxMaxLevel - minMaxLevel) + minMaxLevel)

        let newWidth = minSize + (maxSize - minSize) * Math.random()
        let newHeight = minSize + (maxSize - minSize) * Math.random()
        let x0 = (this.width - newWidth) * 0.5
        let y0 = (this.height - newHeight) * 0.5

        let x1 = x0 + newWidth
        let y1 = y0

        let x2 = x1
        let y2 = y1 + newHeight

        let x3 = x0
        let y3 = y2

        this.segment = new Segment(0, [new Coord(x0, y0), new Coord(x1, y1), new Coord(x2, y2), new Coord(x3, y3)])
    }
}

class Segment{
    constructor(level, coords){
        allSegments.push(this)
        this.id = id
        id++
        this.coords = coords
        this.width = coords[1].x - coords[0].x
        this.height = coords[3].y - coords[0].y
        this.level = level
        this.segments = []
        this.split = -1
        this.splitType = 'n'

        let splitbool = false
        if(this.level <= 1){
            splitbool = true
        } else if(this.level < maxLevel){
            let splitChance = maxSplitChance - ((maxSplitChance - minSplitChance) * this.level / maxLevel)

            if(Math.random() < splitChance){
                splitbool = true
            } else if(!this.isCorrectLengthWidthRatio()){
                splitbool = true
            }
        }

        if(splitbool){
            this.splitType = this.width > this.height ? 'v' : 'h'
            let newCoords = this.getNewCoords(this.coords, this.splitType)
            this.segments.push(new Segment(level+1, newCoords[0]))
            this.segments.push(new Segment(level+1, newCoords[1]))
        }

        if(this.split > 0 || this.segments.length != 0){
            this.color = baseColor
        } else if(this.level < maxLevel - 1){
            this.color = baseColor
        } else {
            this.color = colors[Math.floor(Math.random() * colors.length)]
        }
    }

    isCorrectLengthWidthRatio(){
        let width = this.coords[2] - this.coords[0]
        let height = this.coords[3] - this.coords[1]
        let ratio = Math.max(width/height, height/width)
        return ratio < maxRatio
    }

    drawRecursive(){
        if(this.split > 0){
            this.segments[0].draw()
            this.segments[1].draw()
        } else {
            this.draw()
        }
    }

    draw(){
        fill(this.color)
        // rect(this.coords[0].x, this.coords[0].y, this.width, this.height)
        quad(
            this.coords[0].x, this.coords[0].y, 
            this.coords[1].x, this.coords[1].y, 
            this.coords[2].x, this.coords[2].y, 
            this.coords[3].x, this.coords[3].y
            )
        // rect(this.coords[0].x, this.coords[1], this.coords[2] - this.coords[0], this.coords[3] - this.coords[1])
    }

    getNewCoords(coords, splittype){
        this.split0 = Math.random() * (1 - 2 * minSegmentOffset) + minSegmentOffset
        this.split1 = Math.random() < funkyDiagonalSplitChance ? Math.random() * (1 - 2 * minSegmentOffset) + minSegmentOffset : this.split0
        let newCoords0, newCoords1
        if(splittype == 'v'){
            let splitX0 = coords[0].x + (coords[1].x - coords[0].x) * this.split0
            let splitX1 = funky ? coords[0].x + (coords[1].x - coords[0].x) * this.split1 : splitX0
            let splitCoord0 = new Coord(splitX0, (coords[0].y + coords[1].y) / 2)
            let splitCoord1 = new Coord(splitX1, (coords[2].y + coords[3].y) / 2)
            newCoords0 = [coords[0], splitCoord0, splitCoord1, coords[3]]
            newCoords1 = [splitCoord0, coords[1], coords[2], splitCoord1]
        } else {
            let splitY0 = coords[0].y + (coords[3].y - coords[0].y) * this.split0
            let splitY1 = funky ? coords[0].y + (coords[3].y - coords[0].y) * this.split1 : splitY0
            let splitCoord0 = new Coord((coords[0].x + coords[3].x) / 2, splitY0)
            let splitCoord1 = new Coord((coords[1].x + coords[2].x) / 2, splitY1)
            newCoords0 = [coords[0], coords[1], splitCoord1, splitCoord0]
            newCoords1 = [splitCoord0, splitCoord1, coords[2], coords[3]]
        }

        return [newCoords0, newCoords1]
    }
}

class Coord{
    constructor(x, y){
        this.x = x
        this.y = y
    }
}