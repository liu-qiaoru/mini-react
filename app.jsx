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
    const [count, setCount] = React.useState(10);
    const [bar, setBar] = React.useState('bar');

    React.useEffect(() => {
        console.log('useEffect init');
        return () => {
            console.log('useEffect cleanup');
        }
    }, []);

    React.useEffect(() => {
        console.log('useEffect update', count);
        return () => {
            console.log('useEffect update cleanup');
        }
    }, [count]);

    function onClick(){
        setCount((count) => count + 1);
        setBar('bar');
    }
    return (
        <div>
            {count}
            {bar} 
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
