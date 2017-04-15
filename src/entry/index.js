import Vue from '../vue/core/index.js'

window.vm = new Vue({
    data() {
        return {
            a: 2
        }
    }
})
console.log(vm)