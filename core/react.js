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

// work in progress
let wipRoot = null;
let currentRoot = null; // 表示当前的vdom树， 用来做diff
let newWorkOfUnit = null;
let deletions = [];
let wipFiber = null;
const render = (node, container) => {
    // console.log('render--',node);
    wipRoot = {
        dom: container,
        props: {
            children: [node],
        },
    }
    newWorkOfUnit = wipRoot;
}

function workLoop(deadline) {
    // 当前空余时间已经不够1ms了，不在执行任务
    let shouldYield = deadline.timeRemaining() < 1;
    while (!shouldYield && newWorkOfUnit)  {

        // 渲染一个fiber并获取下一个要渲染的vdom
        newWorkOfUnit = performWorkUnit(newWorkOfUnit);

        if (wipRoot?.sibling?.type === newWorkOfUnit?.type) {
            newWorkOfUnit = null;
        }

        shouldYield = deadline.timeRemaining() < 1;
    }

    // 所有的vdom都已经转换完毕了，这时需要把所有的dom挂载并渲染出来
    if (newWorkOfUnit == null && wipRoot) {
        commitRoot(wipRoot.child);
    }
    requestIdleCallback(workLoop);
}

function commitRoot(fiber) {
    console.log(fiber);
    // 删除
    deletions.forEach(commitDelete);
    // 新增
    commitFiber(fiber);
    currentRoot = wipRoot;
    wipRoot = null;
    deletions = [];
}

function commitDelete(fiber) {
    console.log('delete--', fiber);
    if (fiber.dom) {
        let fiberParent = fiber.parent;
        while(!fiberParent.dom) {
            fiberParent = fiberParent.parent;
        }
        fiberParent.dom.removeChild(fiber.dom);
    } else {
        commitDelete(fiber.child);
    }
}
function commitFiber(fiber) {
    if (fiber == null) return;
    // 挂载到父节点上
    let fiberParent = fiber.parent;
    while(fiberParent.dom == null) {
        fiberParent = fiberParent.parent;
    }

    if (fiber.tag === 'update') {
        // 更新
        updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
    } else if (fiber.tag === 'init') {
        if (fiber.dom) {
            fiberParent.dom.append(fiber.dom);
        }
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

function updateProps(dom, nextProps, prevProps) {
    // if(props == null) return;
    Object.keys(prevProps).forEach(key => {
        if(key !== 'children') {
            if (nextProps[key] == null) {
                // old有 new没有 删除
                dom.removeAttribute(key);
            }
        }
    }); 
    Object.keys(nextProps).forEach(key => {
        // old有 new有 更新成new
        // old没有，新的有，新增
        if (key !== 'children' && nextProps[key] !== prevProps[key]) {
            if (key.startsWith('on')) {
                let event = key.slice(2).toLowerCase();
                dom.removeEventListener(event, prevProps[key]);
                dom.addEventListener(event, nextProps[key]);
            } else {
                dom[key] = nextProps[key];
            }

        }
    }) 
}

function reconcileChildren(fiber, children) {
    let oldFiber = fiber.alternate?.child;
    let prevFiber = null; // 记录sibling的时候要用到前一个fiber节点
    children.forEach((child, index) => {
        let newFiber;
        // 暂时只判断标签类型是不是相同
        let isSameType = oldFiber && oldFiber.type === child.type;
        if (isSameType) {
            // 对节点进行更新
            newFiber = {
                child: null,
                parent: fiber,
                sibling: null,
                type: child.type,
                props: child.props,
                dom: oldFiber.dom, // 更新时dom有值
                alternate: oldFiber,
                tag: 'update',
            };
        } else {
            if (child) {
                // 新节点和旧节点的类型不同，要新建节点，并且删除旧的节点，后续将旧的dom删除
                // 新建节点
                newFiber = {
                    child: null,
                    parent: fiber,
                    sibling: null,
                    type: child.type,
                    props: child.props,
                    dom: null,
                    alternate: oldFiber,
                    tag:'init',
                };
            }
            if (oldFiber) {
                deletions.push(oldFiber);
            }    
        }
        if (oldFiber) {
            oldFiber = oldFiber?.sibling; //  children是数组，child往下走，oldFiber实际是往旁边走
        }
        if (index === 0) {
            fiber.child = newFiber;
        } else {
            prevFiber.sibling = newFiber;
        }
        if (newFiber) {
            prevFiber = newFiber;
        }
    })

    while (oldFiber) {
        deletions.push(oldFiber);
        oldFiber = oldFiber.sibling;
    }
}

function updateFunctionComponent(fiber) {
    wipFiber = fiber;
    // 当fiber是一个fc的时候，就需要把它解析出来，同时把它当作children去转换
    const children = [fiber.type(fiber.props)]; // 把它当作children去转换
    reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
    if (!fiber.dom) {
        // 创建dom
        let dom = (fiber.dom = createDom(fiber.type));
        // fiber.parent.dom.append(dom);

        // 设置props
        updateProps(dom, fiber.props, {});
    }

    // vdom -> 链表
    const children = fiber.props?.children ?? [];
    reconcileChildren(fiber, children);

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

function update() {
    let currentFiber = wipFiber;
    return () => {
        wipRoot = {
            ...currentFiber,
            alternate: currentFiber,
        }
        newWorkOfUnit = wipRoot;

    }
}

const React = {
    update,
    render,
    createElement
}
export default React;