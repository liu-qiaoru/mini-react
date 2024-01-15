// const TEXT_NODE_TYPE = 'TEXT_ELEMENT';

// const TextNode = {
//     type: TEXT_NODE_TYPE,
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
// export { AppNode as APP}


import React from './core/react.js';
// const App = React.createElement('div', {id: 'app'}, 'hello');
// const App = <div id='app'>hello</div>
const App = <div id='app'>
                <div id="app_parent">child</div>
                <div id="app_parent_2">child2</div>
            </div>

export {App}
