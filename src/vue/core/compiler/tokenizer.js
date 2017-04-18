const types = {
    TK_TEXT: 1,
    TK_GT: 2,
    TK_SLASH_GT: 3,
    TK_TAG_NAME: 4,
    TK_ATTR_NAME: 5,
    TK_ATTR_EQUAL: 6,
    TK_ATTR_STRING: 7,
    TK_CLOSE_TAG: 8,
    TK_EOF: 100
}

function Tokenizer (input) {
    this.input = input
    this.index = 0
    this.context = null
    this.eof = false
}

const pp = Tokenizer.prototype

pp.nextToken = function () {
    this.eatSpaces()
    return (
        this.readCloseTag() ||
        this.readTagName() ||
        this.readAttrName() ||
        this.readAttrEqual() ||
        this.readAttrString() ||
        this.readGT() ||
        this.readSlashGT() ||
        this.readText() ||
        this.readEOF() ||
        this.error()
    )
}

pp.peekToken = function () {
    const index = this.index
    const token = this.nextToken()
    this.index = index
    return token
}

/*
 * Read token one by one
 */

pp.readTagName = function () {
    if(this.char() === '<') {
        this.index++
        this.eatSpaces()
        const start = this.index
        while (this.char().match(/[\w\d]/)) {
            this.index++
        }
        const tagName = this.input.slice(start, this.index)
        this.setContext(types.TK_TAG_NAME)
        return {
            type: types.TK_TAG_NAME,
            label: tagName
        }
    }
}

pp.readAttrName = function () {
    if(this.inContext(types.TK_TAG_NAME) && this.char()) {
        const reg = /[\w\-\d]/
        if (!reg.test(this.char())) return
        const start = this.index
        while (this.char() && reg.test(this.char())) {
            this.index++
        }
        return {
            type: types.TK_ATTR_NAME,
            label: this.input.slice(start, this.index)
        }
    }
}

pp.readAttrEqual = function () {
    if(this.inContext(types.TK_TAG_NAME) && this.char() === '=') {
        this.index++
        return {
            type: types.TK_ATTR_EQUAL,
            label: '='
        }
    }
}

pp.readAttrString = function () {
    if(this.inContext(types.TK_TAG_NAME) && /['"]/.test(this.char())) {
        const quote = this.char()
        const start = this.index
        this.index++
        while (!isUndefined(this.char()) && this.char() !== quote) {
            this.index++
        }
        this.index++
        return {
            type: types.TK_ATTR_STRING,
            label: this.input.slice(start + 1, this.index - 1)
        }
    }
}

pp.readCloseTag = function () {
    return this.captureByRegx(/^\<\s*?\/\s*?[\w\d-]+?\s*?\>/, types.TK_CLOSE_TAG)
}

pp.readGT = function () {
    if (this.char() === '>') {
        this.index++
        this.setContext(types.TK_GT)
        return {
            type: types.TK_GT,
            label: '>'
        }
    }
}

pp.readSlashGT = function () {
    return this.captureByRegx(/^\/\>/, types.TK_SLASH_GT)
}

pp.readText = function () {
    if(!this.inContext(types.TK_TAG_NAME)) {
        const start = this.index
        if(!this.char()) return
        this.index++
        while (this.char() && !(/[\<\{]/.test(this.char()))) {
            this.index++
        }
        return {
            type: types.TK_TEXT,
            label: this.input.slice(start, this.index)
        }
    }
}

pp.readEOF = function () {
    if(this.index >= this.input.length) {
        this.eof = true
        return {
            type: types.TK_EOF,
            label: '$'
        }
    }
}

/* 
 * Helpers Functions
 */

pp.eatSpaces = function () {
    while (/\s/.test(this.char())) {
           this.index++
    }
}

pp.setContext = function (type) {
    this.context = type
}

pp.inContext = function (type) {
    return this.context === type
}

pp.char = function () {
    return this.input[this.index]
}

pp.captureByRegx = function (regx, type) {
    const input = this.input.slice(this.index)
    const capture = input.match(regx)
    if(capture) {
        capture = capture[0]
        this.index += capture.length
        this.setContext(type)
        return {
            type: type,
            label: capture
        }
    }
}

pp.test = function () {
    while(!this.eof) {
        console.log(this.nextToken())
    }
}

pp.error = function () {
    throw new Error('Unexpected token: \'' + this.char() + '\'')
}

function isUndefined (value) {
    return value === void 666
}