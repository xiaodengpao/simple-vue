export const nextTick = (function () {
    const callbacks = []
    let pending = false
    let timerFunc = () => {
        setTimeout(nextTickHandler, 0)
    }

    function nextTickHandler () {
        pending = false
        const copies = callbacks.slice(0)
        callbacks.length = 0
        for (let i = 0; i < copies.length; i++) {
            copies[i]()
        }
    }
    return function queueNextTick (cb, ctx) {
        let _resolve
        callbacks.push(() => {
            if(cb) cb.call(ctx)
            if(_resolve) _resolve(ctx)
        })
        if(!pending) {
            pending = true
            timerFunc()
        }
    }
})()