import Vue from '../vue/core/index.js'
let state = false
window.vm = new Vue({
    data: {
        a: undefined
    },
    el: document.getElementById('app'),
    render: function(H) {
        if (state = !state) {
            return H('div', {}, [
                H('input.a', { value: this.a, }, []),
                H('input.b', { value: '旧：1', }, []),
                H('input.c', { value: '旧：2', }, []),
            ])
        }else {
            return H('div', {}, [
                H('input', { value: this.a, }, []),
                H('input.a', { value: '新：1', }, []),
                H('input', { value: '新：2', }, []),
            ])
        }
    }
})