export function setLocation(loc, stage) {
    if (stage === null) {
        return {
            x: (loc.x - this.x()) / this.scaleX(),
            y: (loc.y - this.y()) / this.scaleY()
        };
    } else {
        return {
            x: (loc.x - stage.x()) / stage.scaleX(),
            y: (loc.y - stage.y()) / stage.scaleY()
        };
    }
}

export const ColorMap = {
    start: '#00A170',       // emerald
    binary: '#FDAC53',      // red
    conditional: '#9BB7D4', // purple
    loop: '#B55A30',        // yellow
    void: '#4B5335',        // pinkish
    logical: '#0072B5',      // blue,
    function: '#A0DAA9',
    variable: '#E9897E',
    string: '#926AA6', // greenish
    number: '#D2386C',
    array: '#363945',
    boolean: ' #CD212A'
}


export const state = {
    edit: false,
    focused: true
}