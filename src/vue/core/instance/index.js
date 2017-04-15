import { initMixin } from './init'
import { stateMixin } from './state'

/**
 * Vue构造函数.
 *
 * API conventions:
 * - 对外接口用 `$`
 * - 私有属性用 `_`
 *
 * Vue的构造函数分两部分:
 *	1、_init（）初始化，在init内，将Vue的各类初始化函数运行
 *  2、在Vue原型链上挂载初始化函数(api、internal)，这些函数都是在_init中所需要的
 */

function Vue (options) {
    // 初始化
    this._init(options)
}

initMixin(Vue)
stateMixin(Vue)

export default Vue
