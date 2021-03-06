/**
* @ author: xingdongpeng
* @ name: observe
* @ date: 2017-04-15
* @ desc: 这个类实现的目的是为了代理JSON对象的key，new Observer() 生产的类的实例是我们需要的响应式数据
*/
import { Dep } from './dep'
import { Watcher } from './watcher'

class Observer {
    constructor(data, vm) {
        // 递归
        this.walk(data)
        this._vm = vm
    }

    // 遍历data对象的属性
    walk(obj) {
        let val
            // babel 不支持for of
        for (let key in obj) {
            // for...in 循环会把对象原型链上的所有可枚举属性都循环出来，用hasOwnProperty过滤。
            if (obj.hasOwnProperty(key)) {
                val = obj[key]
                this.convert(key, val)
            }
        }
    }
    update() {
        if(this._vm && this._vm.$options && this._vm.$options.render) {
            this._vm.$render()
        }
    }

    // 定义响应式变量，代理data的key --> 返回响应式数据
    convert (key, val) {
        // 每个key一个订阅器。因为在闭包函数中声明dep，所以dep一对一的。
        let dep = new Dep();
        // this指向 Observer 的实例，把this改装成响应式对象
        Object.defineProperty(this, key, {
            enumerable: true,
            configurable: true,
            get: function () {
                // 如果是watcher初始化的时候调用get就把watcher添加进Dep
                if(Dep.target) {
                    dep.addSub(Dep.target);
                }
                return val
            },
            set: function (newVal) {
                if (newVal === val) return;
                val = newVal
                this.update()
                dep.notify()
            }
        })
    }
}

// 通过observe改变this指向
function observe (data, vm) {
    if (!data || typeof data !== 'object') {
        return
    }
    vm._data = new Observer(data, vm)
}

export { observe }