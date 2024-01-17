import React from './core/react.js';

let count = 10;
let props = {id: 'iddddd'};
const Counter = ({num = 10}) => {

    function onClick(){
        count++;
        props = {};
        React.update();
    }
    return (
        <div {...props}>
            count = {count}
            <button onClick={onClick}>click</button>
        </div>
    )
}

const Container = () => {
    return <Counter />
}
const App = <div id='app'>
                {/* <div id="app_parent">child</div> */}
                {/* <div id="app_parent_2">child2</div> */}
                <Container />
                {/* <Counter num={10} /> */}
                {/* <Counter num={20} /> */}
            </div>

export {App}
