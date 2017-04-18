import { api, isArray} from '../util/index'
import { createEle, updateEle } from './index'

// 判断是否值得比较
function sameVnode (oldVnode, vnode) {
    return vnode.key === oldVnode.key && vnode.sel === oldVnode.sel
}
function createKeyToOldIdx (children, beginIdx, endIdx) {
    var i, map = {}, key, ch
    for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i]
        if (ch != null) {
            key = ch.key
            if (key !== null)
                map[key] = i
        }
    }
    return map
}
function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for(;startIdx <= endIdx; ++startIdx) {
        var ch = vnodes[startIdx]
        if (ch != null) {
            api.removeChild(parentElm, ch.el)
        }
    }
}
function addVnodes (parentElm, before, vnodes, startIdx, endIdx) {
    for (;startIdx <= endIdx; ++startIdx) {
        var ch = vnodes[startIdx]
        if (ch != null) {
            api.insertBefore(parentElm, createEle(ch).el, before)
        }
    }
}


function patchVnode (oldVnode, vnode) {
    // 既然是打补丁，那么el是相同的
    const el = vnode.el = oldVnode.el
    let i, oldCh = oldVnode.children, ch = vnode.children
    // 如果引用相同，则认为完全一致
    if (oldVnode === vnode) return
    // 文本节点的比较
    if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text)
    // 非文本节点
    }else {
        // 更新节点
        updateEle(el, vnode, oldVnode)
        // 更新子节点
        if (oldCh && ch && oldCh !== ch) {
            updateChildren(el, oldCh, ch)
        // 新增子节点
        } else if(ch) {
            createEle(vnode)
        // 移除oldVnode的子节点
        }else if(oldCh) {
            api.removeChildren(el)
        }
    }
}

function updateChildren (parentElm, oldCh, newCh) {
    let oldStartIdx = 0, newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx
    let idxInOld
    let elmToMove
    let before
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if(oldStartVnode == null) {
            oldStartVnode = oldCh[++oldStartIdx]
        }else if(oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx]
        }else if(newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx]
        }else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx]
        }else if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
        }else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
        }else if (sameVnode(oldStartVnode, newEndVnode)) {
            patchVnode(oldStartVnode, newEndVnode)
            api.insertBefore(parentElm, oldStartVnode.el, api.nextSibling(oldEndVnode.el))
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
        }else if (sameVnode(oldEndVnode, newStartVnode)) {
            patchVnode(oldEndVnode, newStartVnode)
            api.insertBefore(parentElm, oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
        }else {
            if (oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
            }
            idxInOld = oldKeyToIdx[newStartVnode.key]
            if (!idxInOld) {
                api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                newStartVnode = newCh[++newStartIdx]
            }
            else {
                elmToMove = oldCh[idxInOld]
                if (elmToMove.sel !== newStartVnode.sel) {
                    api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                }else {
                    patchVnode(elmToMove, newStartVnode)
                    oldCh[idxInOld] = null
                    api.insertBefore(parentElm, elmToMove.el, oldStartVnode.el)
                }
                newStartVnode = newCh[++newStartIdx]
            }
        }
    }
    if (oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
    }else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
}

/*
 * 打补丁算法
 * 打补丁过程中修正EL，其实是把diff和render合并在一起
 */
export function patch (oldVnode, vnode) {
    // 值得比较
    if(sameVnode(oldVnode, vnode)) {
        // 打补丁
        patchVnode(oldVnode, vnode)
    // 不值得比较
    } else {
        // vnode要替换的DOM
        const oEl = oldVnode.el
        // 取得oldVnode的父节点
        let parentEle = api.parentNode(oEl)
        // 根据vnode创建新的DOM节点
        createEle(vnode)
        if (parentEle !== null) {
            // 新DOM插入，旧DOM移除
            api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl))
            api.removeChild(parentEle, oldVnode.el)
            oldVnode = null
        }
    }
    // 返回新的虚拟节点
    return vnode
}