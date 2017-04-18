import { api, isObject, isString } from '../util/index'

export function createEle (vnode) {
    let i, e
    if(!vnode.el && (i = vnode.text)) {
        e = vnode.el = api.createTextNode(i)
        return vnode
    }
    if((i = vnode.tagName) && vnode.el === null) {
        e = vnode.el = api.createElement(i)
    }else if (vnode.el.nodeType === 1) {
        e = vnode.el
    }
    // 循环递归
    updateEle(e, vnode)
    return vnode
}

// 更新当前节点
export function updateEle (e, vnode, oldVnode) {
    let i
    // 设置属性
    if((i = vnode.className).length > 0) api.setClass(e, i)
    if((i = vnode.data) !== null) api.setAttrs(e, i)
    if((i = vnode.id) !== null) api.setId(e, i)
    // 存在子节点 && oldVnode为空
    if((i = vnode.children) !== null && !oldVnode) {
        // e -> parentElement
        // i -> childVnode
        api.appendChildren(e, i)
    }
}