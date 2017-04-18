import { isString, isObject, isArray, toArray, error, isNumber, api } from '../util/index'
import { Vnode, createEle } from './index'

function parseQuery (vnode, query) {
    let k, state = 0, j = 0
    vnode.sel = query
    for(let i = 0, len = query.length; i < len; i++) {
        let char = query[i]
        if(char === '.' || char === '#' || (k = i === len - 1)) {
            if(state === 0) {
                vnode.tagName = query.substring(j, !k ? i : len).toUpperCase()
            }else if(state === 1) {
                vnode.className.push(query.substring(j, !k ? i : len))
            }else if(state === 2) {
                vnode.id = query.substring(j, !k ? i : len)
            }
            state = (char === '.') ? 1 : (char === '#') ? 2 : 3
            j = i + 1
        }
    }
}

function parseData (vnode, v) {
    for(let k in v) {
        if(k === 'class') {
            let i = v[k].split(' ')
            for(let j = 0; j < i.length; j++) {
                vnode.className.push(i[j])
            }
        }else if(k === 'key') {
            vnode.key = v[k]
        }else if(k !== 'style') {
            vnode.attr.push(k)
        }
    }
    vnode.data = v
}

function parseChindren (vnode, v) {
    let a = []
    if (isString(v) || isNumber(v)) v = [v]
    for (let i = 0; i < v.length; i++) {
        if (!(v[i] instanceof Vnode)) {
            a.push(createVnodeTxt(v[i]))
        }else {
            a.push(v[i])
        }
    }
    vnode.children = a
}

export function createVnodeTxt (str) {
    let vd = new Vnode()
    if(isString(str) || isNumber(str)) {
        vd.text = str
    }
    return vd
}

// 根据render函数创建虚拟dom
export function createVnode (arg) {
    let i = 0, vd = new Vnode()
    while(i < arg.length) {
        let v = arg[i]
        if(i === 0 && isString(v)) {
            // tag
            parseQuery(vd, v)
        }else if(i != 0) {
            if(isObject(v)) {
                // id、style、ect
                parseData(vd, v)
            }else if (isArray(v) || isString(v) || isNumber(v)) {
                // 子节点
                parseChindren(vd, v)
            }
        }
        i++
    }
    return vd
}

// render函数的参数，依赖于createVnode
export function CV () {
    const arg = toArray(arguments)
    if (arg.length === 0) {
        error('Parameter cannot be empty')
        return false
    }
    if (isArray(arg) && arg.length > 0) {
        return createVnode.call(this, arg)
    }
}