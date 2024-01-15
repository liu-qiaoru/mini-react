import React from './core/react.js';

const Counter = ({num = 10}) => {
    return <div>count = {num}</div>
}

const Container = () => {
    return <Counter />
}
const App = <div id='app'>
                {/* <div id="app_parent">child</div> */}
                {/* <div id="app_parent_2">child2</div> */}
                <Container />
                {/* <Counter num={10} />
                <Counter num={20} /> */}
            </div>

export {App}
