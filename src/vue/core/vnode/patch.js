import { api, isArray} from '../util/index'
import { createEle, updateEle } from './index'

// 判断是否值得比较
function sameVnode (oldVnode, vnode) {
    return vnode.key === oldVnode.key && vnode.sel === oldVnode.sel
}
// 根据Vnode的key值创建index表
function createKeyToOldIdx (children, beginIdx, endIdx) {
    var i, map = {}, key, child
    for (i = beginIdx; i <= endIdx; ++i) {
        child = children[i]
        if (child != null) {
            key = child.key
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

/*
 * 打补丁算法，判断是否有子节点，如果有，进入updateChildren
 */
function patchVnode (oldVnode, vnode) {
    // 打完补丁，oldVnode就没用了，把el挂载到vnode上
    const el = vnode.el = oldVnode.el
    let oldCh = oldVnode.children, ch = vnode.children
    // 如果引用相同，则认为完全一致
    if(oldVnode === vnode) return
    // 文本节点的比较
    if(oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text)
    // 非文本节点
    }else {
        // 更新节点
        updateEle(el, vnode, oldVnode)
        // 更新子节点
        if(oldCh && ch && oldCh !== ch) {
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

/*
 * diff算法的主要逻辑
 * 涉及子节点，遍历流程，处理逻辑
 * 主要作用是最大化复用子节点
 * 1 --> 1 对应的关系，通过挪动真实节点的位置，满足新虚拟DOM的位置
 * 类似于依靠newCh >= oldCh
 */
function updateChildren (parentElm, oldCh, newCh) {
    debugger
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
        // 以上略过
        // 以下注释以OLD为基准
        // startVnode位置没变
        }else if(sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode)
            // 新旧: start++
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
        // endVnode位置不变
        }else if(sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode)
            // 新旧: end--
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
        // startVnode跑到了最后
        }else if(sameVnode(oldStartVnode, newEndVnode)) {
            // vnode.el <-- oldVnode.el
            patchVnode(oldStartVnode, newEndVnode)
            // 挪动真实DOM的位置
            // api.nextSibling(oldEndVnode.el) 必须是oldVnode 因为真实DOM很可能还没挂载在Vnode.el上
            api.insertBefore(parentElm, oldStartVnode.el, api.nextSibling(oldEndVnode.el))
            // 旧: start++ 新: end--
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
        // endVnode跑到了最前面
        }else if(sameVnode(oldEndVnode, newStartVnode)) {
            patchVnode(oldEndVnode, newStartVnode)
            api.insertBefore(parentElm, oldEndVnode.el, oldStartVnode.el)
            // 旧: end-- 新: start++
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
        // 以上匹配都不通过时,通过key匹配
        }else {
            // 生成旧节点Id->index表
            if(oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
            }
            // 新节点在旧节点组中的位置
            // key ---> i，即：map(key) = i
            idxInOld = oldKeyToIdx[newStartVnode.key]
            // 没找到,创建DOM
            if(!idxInOld) {
                // < new >  < old >
                // 创建newStartVnode到oldStartVnode的前头
                api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                // 新: start++
                newStartVnode = newCh[++newStartIdx]
            // 找到啦
            } else {
                elmToMove = oldCh[idxInOld]
                if(elmToMove.sel !== newStartVnode.sel) {
                    api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                }else {
                    patchVnode(elmToMove, newStartVnode)
                    // 这一步体现了最开始判断null的意义，不移动只是置为null
                    oldCh[idxInOld] = null
                    api.insertBefore(parentElm, elmToMove.el, oldStartVnode.el)
                }
                newStartVnode = newCh[++newStartIdx]
            }
        }
    }
    if(oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
    }else if(newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
}

/*
 * 打补丁算法，判断是否值得比较，如果值得比较进入patchVnode函数
 * 打补丁过程中修正EL，把diff和DOM操作合并在一起
 * patch函数打root的补丁
 */
export function patch (oldVnode, vnode) {
    console.log(oldVnode)
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
        // 根据vnode创建新的DOM节点,DOM挂载到el属性上
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