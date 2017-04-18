import { error, isArray, isObject, isString } from './index'
import { Vnode, createEle } from '../vnode/index'

export let api = Object.create(null)

api.createElement = function (tag) {
    return document.createElement(tag)
}
api.createTextNode = function (txt) {
    return document.createTextNode(txt)
}
api.appendChild = function (parent, child) {
    return parent.appendChild(child)
}
api.parentNode = function (node) {
    return node.parentNode
}
// newNode插入到parent下面，rf前
api.insertBefore = function (parent, newNode, rf) {
    return parent.insertBefore(newNode, rf)
}
// 返回相同层级的下一个节点
api.nextSibling = function (el) {
    return el.nextSibling
}
api.removeChild = function (parent, rc) {
    return parent.removeChild(rc)
}
// 修改当前节点的文本节点
api.setTextContent = function (ele, txt) {
    ele.textContent = txt
}
api.setId = function (ele, id) {
    ele.id = id
}
api.defineProperty = function (obj, prop, descriptor) {
    Object.defineProperty(obj, prop, descriptor)
}

// 把当前vnode虚拟子节点DOM化，并且扔到当前vnode的el下
api.appendChildren = function (ele, children) {
    if(ele && isArray(children)) {
        for(let i = 0; i < children.length; i++) {
            let c
            if (children[i] instanceof Vnode) {
                // 创建子节点真实dom
                c = children[i].el || createEle(children[i]).el
            }
            this.appendChild(ele, c)
        }
    }
}
api.setClass = function (ele, c) {
    if(ele && isArray(c)) {
        let k = ''
        for(let i = 0; i < c.length; i++) {
            // ele.classList.add(c[i])
            if(i !== c.length - 1) {
                k += c[i] + ' '
            }else{
                k += c[i]
            }
        }
        ele.className = k
    }
}
api.setAttrs = function (ele, a) {
    if(ele && isObject(a)) {
        for(let k in a) {
            if (k === 'class') continue
            let s = a[k]
            if (k === 'style' && isObject(s)) {
                for(let j in s) {
                    ele.style[j] = s[j]
                }
            }else {
                ele[k] = s
            }
        }
    }
}
api.removeChildren = function (ele) {
    let i, ch = ele.childNodes
    while(ch[0]) {
        this.removeChild(ele, ch[0])
    }
}