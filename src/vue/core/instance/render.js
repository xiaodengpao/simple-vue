import { nextTick } from '../util/index'
import { parser } from '../compiler/index'
import { CV, patch, createEle } from '../vnode/index'
import { api } from '../util/index'

export function initRender (vm) {
    // 返回vnode
    vm._vnode = vm.$options.render.call(vm, CV)
}
// $vnode: 有EL的vnode
// _vnode: 没有EL的vnode
export function renderMixin (Vue) {
    Vue.prototype.$mount = function(parent) {
        const vnode = this._vnode
        // vnode进行渲染
        this.$vnode = createEle(vnode)
        api.appendChild(parent, this.$vnode.el)
    }
    Vue.prototype.$render = function() {
        const $newVnode = vm.$options.render.call(vm, CV)
        patch(this.$vnode, $newVnode)
        this.$vnode = $newVnode
    }
}
