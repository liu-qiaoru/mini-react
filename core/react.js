const TEXT_NODE_TYPE = 'TEXT_ELEMENT';
// 灵活创建虚拟dom
const createElement = (type, props, ...children) => {
    console.log('createElement');
    return {
        type: type, 
        props: {
            ...props,
            children: children.map(item => {
                const isTextNode = typeof item === 'string' || typeof item === 'number';
                return isTextNode ? createTextNode(item): item
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
    let fiberParent = fiber.parent;
    while(fiberParent.dom == null) {
        fiberParent = fiberParent.parent;
    }
    if (fiber.dom) {
        fiberParent.dom.append(fiber.dom);
    }
    // 递归挂载子节点
    commitFiber(fiber.child);
    commitFiber(fiber.sibling);

}

function createDom(type) {
    // console.log(type);
    return type === TEXT_NODE_TYPE 
    ? document.createTextNode('')
    : document.createElement(type)
}

function updateProps(dom, props) {
    if(props == null) return;
    Object.keys(props).forEach(key => {
        if (key !== 'children') {
            dom[key] = props[key];
        }
    }); 
}

function initChildren(fiber, children) {
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

function updateFunctionComponent(fiber) {
    // 当fiber是一个fc的时候，就需要把它解析出来，同时把它当作children去转换
    const children = [fiber.type(fiber.props)]; // 把它当作children去转换
    initChildren(fiber, children);
}

function updateHostComponent(fiber) {
    if (!fiber.dom) {
        // 创建dom
        let dom = (fiber.dom = createDom(fiber.type));
        // fiber.parent.dom.append(dom);

        // 设置props
        updateProps(dom, fiber.props);
    }

    // vdom -> 链表
    const children = fiber.props?.children ?? [];
    initChildren(fiber, children);
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
    let isFunctionType = typeof fiber.type === 'function';
    if (isFunctionType) {
        updateFunctionComponent(fiber);
    }else {
        updateHostComponent(fiber)
    }

    // 返回下一个节点
    if (fiber.child) {
        return fiber.child;
    }
    if (fiber.sibling) {
        return fiber.sibling;
    }

    // parent.sibling不一定存在，比如fc，这时候就要继续向上查找
    let fiberParent = fiber.parent;
    while(fiberParent) {
        if (fiberParent.sibling) return fiberParent.sibling;
        fiberParent = fiberParent.parent;
    }
}

requestIdleCallback(workLoop);

const React = {
    render,
    createElement
}
export default React;