import { isString, isObject, isArray, toArray, error, isNumber, api } from '../util/index'
import { Vnode, createEle } from './index'

// 对标签进行处理
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

// 对data进行分类分流
function parseData (vnode, data) {
    for(let key in data) {
        if(key === 'class') {
            let i = data[key].split(' ')
            for(let j = 0; j < i.length; j++) {
                vnode.className.push(i[j])
            }
        }else if(key === 'key') {
            vnode.key = data[key]
        }else if(key !== 'style') {
            vnode.attr.push(key)
        }
    }
    // 原始数据
    vnode.data = data
}

// 处理子节点
// text是子节点的一种，字符串默认为textNode
// eg: ['hahhaa']
function parseChindren (vnode, origChren) {
    let children = []
    if (isString(origChren) || isNumber(origChren)) origChren = [origChren]
    for (let i = 0; i < origChren.length; i++) {
        if (!(origChren[i] instanceof Vnode)) {
            // 如果是字符串，创建textVnode
            children.push(createVnodeTxt(origChren[i]))
        }else {
            children.push(origChren[i])
        }
    }
    vnode.children = children
}

export function createVnodeTxt (str) {
    let vd = new Vnode()
    if(isString(str) || isNumber(str)) {
        vd.text = str
    }
    return vd
}

// 根据render函数创建虚拟dom
// args参数： 1、tag 2、data 3、children
export function createVnode (args) {
    let i = 0, vd = new Vnode()
    while(i < args.length) {
        let arg = args[i]
        if(i === 0 && isString(arg)) {
            // tag
            parseQuery(vd, arg)
        }else if(i != 0) {
            if(isObject(arg)) {
                // id、style、ect
                parseData(vd, arg)
            }else if (isArray(arg) || isString(arg) || isNumber(arg)) {
                // 子节点
                parseChindren(vd, arg)
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