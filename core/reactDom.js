


// 初版
// const createElement = (node, container) => {
//     let dom = node.type === 'TEXT_ELEMENT' 
//             ? document.createTextNode(node.nodeValue)
//             : document.createElement(node.type);
    
//     Object.keys(node.props).forEach(key => {
//         dom[key] = node.props[key];
//     }); // props


//     node.children.map(child => createElement(child, dom));
//     container.append(dom);
// }


// // 实际上这里有点按照api去反推逻辑的
// const createRoot = (container) => {
//     return {
//         render: (node) => createElement(node, container),
//     }

// }

// export {createRoot}


/**
 * 和教学视频的差异
 * 1. 动态创建虚拟dom不够灵活
 * 2. 创建思路不清晰
 *    1. 灵活创建vdom
 *    2. 使用虚拟dom灵活创建节点
 *    3. 导出的对象： 应该导出一个ReactDom对象，对象中包括createRoot函数，createRoot返回对象里包含一个render函数
 */

// 修改
import React from './react.js'
const createRoot = (container) => {
    return {
        render: (node) => React.render(node, container),
    }

}

const ReactDom = {
    createRoot
}
export { ReactDom }