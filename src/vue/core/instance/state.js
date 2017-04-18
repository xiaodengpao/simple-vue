import { Dep } from '../observer/dep'
import { Watcher } from '../observer/watcher'
import { observe } from '../observer'

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: function() {},
    set: function() {}
}

export function initState (vm) {
    vm._watchers = []
    const opts = vm.$options
    initData(vm)
    if(opts.watch) {
        initWatch(vm, opts.watch)
    }
}

export function stateMixin (Vue) {
    // 代理$data
    const dataDef = {}
    dataDef.get = function () {
        return this._data
    }
    Object.defineProperty(Vue.prototype, '$data', dataDef)
    Vue.prototype.$watch = function (expOrFn, cb, options) {
        const vm = this
        options = options || {}
        const watcher = new Watcher(vm, expOrFn, cb, options)
        return function unwatchFn () {
            watcher.teardown()
        }
    }
}

// 内部使用函数
function initData (vm) {
    // 判断函数OR对象
    let data = vm.$options.data
    data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}
    const keys = Object.keys(data)
    let i = keys.length
    while (i--) {
        proxy(vm, `_data`, keys[i])
    }
    // observe data
    observe(data, vm)
}

function getData (data, vm) {
    try {
        return data.call(vm)
    } catch (e) {
        console.log(e)
        return {}
    }
}
function proxy (target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter (val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}
