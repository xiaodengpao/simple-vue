import { initState } from './state'

// 全局Vue实例个数，VueID
let uid = 0

export function initMixin (Vue) {
    Vue.prototype._init = function (options) {
        // 检查this是否合格，用vm代替this
        const vm = this

        // 每次实例化，自动++
        vm._uid = uid++

        vm.$options = options

        vm._self = vm

        // 运行接口，挂载接口在index.js中
        // initLifecycle(vm)
        // initEvents(vm)
        // initRender(vm)
        // callHook(vm, 'beforeCreate')
        // initInjections(vm)
        initState(vm)
        // initProvide(vm)
        // callHook(vm, 'created')

        // 如果options中声明了挂载对象el
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
}