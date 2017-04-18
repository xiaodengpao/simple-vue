export function Vnode () {
    // 节点的标签，DIV
    this.tagName = null

    // 节点的选择器，判断是否有比较价值，相同才会继续比较
    this.sel = null

    // 节点的ID
    this.id = null

    // 节点的class
    this.className = []

    // 节点的子节点
    this.children = null

    // 对真实的节点的引用
    this.el = null

    // 存储节点属性的对象
    this.data = null

    this.key = null

    // 文本节点
    this.text = null

    this.attr = []
}