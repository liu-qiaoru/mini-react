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
let root = null;
let nextFiber = null;
const render = (node, container) => {
    console.log('render--',node);
    nextFiber = {
        dom: container,
        props: {
            children: [node],
        },
    }
    root = nextFiber;
}

function workLoop(deadline) {
    // 当前空余时间已经不够1ms了，不在执行任务
    let shouldYield = deadline.timeRemaining() < 1;
    while (!shouldYield && nextFiber)  {

        // 渲染一个fiber并获取下一个要渲染的vdom
        nextFiber = performWorkUnit(nextFiber);

        shouldYield = deadline.timeRemaining() < 1;
    }

    // 所有的vdom都已经转换完毕了，这时需要把所有的dom挂载并渲染出来
    if (nextFiber == null && root) {
        commitRoot(root.child);
    }
    requestIdleCallback(workLoop);
}

function commitRoot(fiber) {
    console.log(fiber);
    commitFiber(fiber);
    root = null;
}

function commitFiber(fiber) {
    if (fiber == null) return;
    // 挂载到父节点上
    fiber.parent.dom.append(fiber.dom);
    // 递归挂载子节点
    commitFiber(fiber.child);
    commitFiber(fiber.sibling);

}

function createDom(type) {
    return type === TEXT_NODE_TYPE 
    ? document.createTextNode('')
    : document.createElement(type)
}

function updateProps(dom, props) {
    Object.keys(props).forEach(key => {
        if (key !== 'children') {
            dom[key] = props[key];
        }
    }); 
}

function initChildren(fiber) {
    let children = fiber.props.children;
    let prevFiber = null; // 记录sibling的时候要用到前一个fiber节点
    children.forEach((child, index) => {
        let newFiber = {
            child: null,
            parent: fiber,
            sibling: null,
            type: child.type,
            props: child.props,
            dom: null,
        };
        if (index === 0) {
            fiber.child = newFiber;
        } else {
            prevFiber.sibling = newFiber;
        }
        prevFiber = newFiber;
    })

}
/**
 * fiber中需要包含的结构有
 * 1. child：Fiber类型
   2. sibling： Fiber
   3. parent: Fiber类型
   4. type
   5. props
   6. dom // 是干嘛的
 */
function performWorkUnit(fiber) {

    if (!fiber.dom) {
        // 创建dom
        let dom = (fiber.dom = createDom(fiber.type));
        // fiber.parent.dom.append(dom);
    }
    // 设置props
    updateProps(fiber.dom, fiber.props);

    // vdom -> 链表
    initChildren(fiber);

    // 返回下一个节点
    if (fiber.child) {
        return fiber.child;
    }
    if (fiber.sibling) {
        return fiber.sibling;
    }
    return fiber.parent.sibling;

}

requestIdleCallback(workLoop);

const React = {
    render,
    createElement
}
export default React;