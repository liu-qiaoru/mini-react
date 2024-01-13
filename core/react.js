const TEXT_NODE_TYPE = 'TEXT_ELEMENT';
// 灵活创建虚拟dom
const createElement = (type, props, ...children) => {
    console.log('createElement');
    return {
        type: type, 
        props: {
            ...props,
            children: children.map(item => {
                return typeof item === 'string' ? createTextNode(item): item
            }) // 考虑直接创建textNode节点
        } // 最开始写的时候children放在了props外面，放里面和放外面的区别，会对后续有什么影响？？
    }
}
const createTextNode = (val) => {
    return {
        type: TEXT_NODE_TYPE,
        props: {
            nodeValue: val,
            children: []
        }
    }
}


const render = (node, container) => {
    console.log('render--',node);
    let dom = node.type === TEXT_NODE_TYPE 
            ? document.createTextNode(node.nodeValue)
            : document.createElement(node.type);
    
    Object.keys(node.props).forEach(key => {
        if (key !== 'children') {
            dom[key] = node.props[key];
        } // TODO- 如果把children移到props外面，这里就可以少一步判断，会不会更好？？
    }); // props


    node.props.children.forEach(child => render(child, dom));
    container.append(dom);
}

const React = {
    render,
    createElement
}
export default React;