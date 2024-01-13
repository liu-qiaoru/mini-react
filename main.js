// 1. 创建一个div，其textNode是‘app’

// let App = document.createElement('div'); // type
// App.id = 'app'; // props

// let textNode = document.createTextNode('app');
// App.append(textNode); // children

// const root = document.querySelector('#root');
// root.append(App);


// // 2.  vdom : type, props, children
// const AppNode = {
//     type: 'div',
//     nodeValue: '',
//     props: {
//         id: 'app'
//     }, 
//     children: [TextNode]
// }

// const TextNode = {
//     type: 'TEXT_ELEMENT',
//     nodeValue: 'hello',
//     children: []
// }

// let App = document.createElement(AppNode.type); // type

// Object.keys(AppNode.props).forEach(key => {
//     App[key] = AppNode.props[key];
// }); // props

// let textNode = document.createTextNode(TextNode.nodeValue);
// App.append(textNode); // children

// const root = document.querySelector('#root');
// root.append(App);

// // 3. 抽出通用方法, 创建节点，把节点渲染到根节点上
// const TextNode = {
//     type: 'TEXT_ELEMENT',
//     nodeValue: 'hello',
//     props: {},
//     children: []
// }

// const AppNode = {
//     type: 'div',
//     nodeValue: '',
//     props: {
//         id: 'app'
//     }, 
//     children: [TextNode]
// }


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

// 初版： 最终拆分模块
// import { App } from './app.js';
// import { createRoot } from './core/reactDom.js';

// createRoot(document.querySelector('#root')).render(App);

// 修正
import { App } from './app.jsx';
import { ReactDom } from './core/reactDom.js';

ReactDom.createRoot(document.querySelector('#root')).render(App);