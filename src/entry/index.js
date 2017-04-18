import Vue from '../vue/core/index.js'

window.vm = new Vue({
    data: {
        a: 2
    },
    el: document.body,
    render: function(CV) {
        return CV('div', {'style': 'background: red;'}, [
            CV('Input', {'value': this.a}, []),
            'hahhahahaa'
        ])
    }
})