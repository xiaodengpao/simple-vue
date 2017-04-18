/**
* @ author: xingdongpeng
* @ name: Watcher
* @ date: 2017-04-15
* @ desc: 观察者，被回调的对象，存放于Dep数组中
*/
import { Dep } from './dep'
class Watcher {
    // watcher会触发data的get代理
    constructor(vm, expOrFn, cb) {
        this.cb = cb
        this.vm = vm
        this.expOrFn = expOrFn
        // 获取监听key的value，此时会进入key的闭包环境，并趁机添加进Dep数组
        this.value = this.get()
    }
    update() {
        // 调用回调函数
        this.run()
    }
    run() {
        const value = this.get()
        if(value !== this.value) {
            // 上下文换成vm对象，供回调函数使用
            this.cb.call(this.vm, value, this.value)
            this.value = value
        }
    }
    // 创建watcher时候会调用，此时如果是第一次创建，那么把watcher添加到Dep数组
    get() {
        Dep.target = this
        // watcher和data都在vm对象下，watch自身的key
        const value = this.vm._data[this.expOrFn]
        // 用后清空
        Dep.target = null
        return value
    }
    remove() {
        console.log('remove')
    }
}

export { Watcher }