import { api, isObject, isString } from '../util/index'

// 给Vnode创建el对象
export function createEle (vnode) {
    // 创建根root
    let property, el
    if(!vnode.el && (property = vnode.text)) {
        el = vnode.el = api.createTextNode(property)
        return vnode
    }
    if((property = vnode.tagName) && vnode.el === null) {
        el = vnode.el = api.createElement(property)
    }else if (vnode.el.nodeType === 1) {
        el = vnode.el
    }
    // 循环递归，创建子节点DOM，并建立真实DOM关系
    updateEle(el, vnode)
    return vnode
}

// 更新当前节点
export function updateEle (e, vnode, oldVnode) {
    let property
    // 设置属性
    if((property = vnode.className).length > 0) api.setClass(e, property)
    if((property = vnode.data) !== null) api.setAttrs(e, property)
    if((property = vnode.id) !== null) api.setId(e, property)
    // 存在子节点 && oldVnode为空
    if((property = vnode.children) !== null && !oldVnode) {
        // e -> parentElement
        // property -> childVnode
        api.appendChildren(e, property)
    }
}