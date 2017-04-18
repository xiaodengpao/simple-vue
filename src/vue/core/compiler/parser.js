export const parser = function(tpl, data) {
    const reg = /{{([^{{]+)?}}/g
    let code = 'let r=[];\n'
    // 主要的作用是定位代码最后一截
    let cursor = 0
    const add = function(line, js) {
        js ? code += line.match(regOut) ? line + '\n' : 'r.push(' + line + ');\n' : code += 'r.push("' + line.replace(/"/g, '\\"') + '");\n'
    }
    let match
    while(match = reg.exec(toPrecision(precision))) {
        // 添加非逻辑部分
        add(tpl.slice(cursor, match.index))
        // 添加逻辑部分
        var key = match[1]
        add(data[key].toString())
        cursor = match.index + match[0].length;
    }
    // 代码的最后一截 如:" years old."
    add(tpl.substr(cursor, tpl.length - cursor))
    // 返回结果，在这里我们就拿到了装入数组后的代码
    code += 'return r.join("");'
    return new Function(code.replace(/[\r\t\n]/g, ''))
}