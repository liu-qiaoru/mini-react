import React from './core/react.js';

let props = {id: 'iddddd'};
const Counter = ({num = 10}) => {
    return (
        <div {...props}>
            count = {num}
        </div>
    )
}

const Counter1 = () => {
    return (
        <div>
            'hello'
            <div>
                第二个 hello
            </div>

<div>第三个 hello</div>
        </div>
    )
}

const Text1 = () => <div>hello</div>;
const Text2 = () => <div>xxx<div>www</div></div>;
let showChild = false;
const Container = () => {
    let update = React.update();
    function onClick(){
        showChild = !showChild;
        update();
    }
    return (
        <div>
            count
            {showChild ? <Text2 /> : <Text1 />} 
            <button onClick={onClick}>showChild</button>
        </div>
    )
}
const App = () => {

    return (
        <div id='app'>
            <Container />
        </div>
    )
};

export {App}
