import { useState } from "react";

const Counter = () => {
    const [count, setCount] = useState(0);

    const handleIncrease = () => {
        setCount(previousCount => previousCount + 1);
    };

    const handleDecrease = () => {
        setCount(previousCount =>
            previousCount > 0 ? previousCount - 1 : 0
        );
    };

    const handleReset = () => {
        setCount(0);
    };

    return (
        <div className="counter">
            <h2>Counter</h2>

            <h1>{count}</h1>

            <button onClick={handleIncrease}>
                Increase
            </button>

            <button onClick={handleDecrease}>
                Decrease
            </button>

            <button onClick={handleReset}>
                Reset
            </button>
        </div>
    );
};

export default Counter;