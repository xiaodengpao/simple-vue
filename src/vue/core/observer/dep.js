/**
* @ author: xingdongpeng
* @ name: 消息订阅器
* @ date: 2017-04-15
*/

class Dep {
    constructor() {
        // 存放Watcher
        this.subs = []
    }
    // 添加Watcher
    addSub(sub) {
        this.subs.push(sub)
    }
    notify() {
        this.subs.forEach(sub => sub.update())
    }
}

export { Dep }