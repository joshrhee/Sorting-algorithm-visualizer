//There will be ... in-front-of 'lodash' if Typescript could not figure out the lodash library. Then, do the below at the terminal
//command: yarn add @types/lodash
import { range, shuffle, sortBy, values } from 'lodash'
import { FC, useState } from 'react'

const SIZE = 30
const getArr = () => shuffle(range(1, SIZE + 1))

const sort = (arr: number[]) => {
    let i = 1
    while (i < arr.length) {
        let j = i
        while (j > 0 && arr[j - 1] > arr[j]) {
            let temp = arr[j]
            arr[j] = arr[j - 1]
            arr[j - 1] = temp
            j = j - 1
        }
        i = i + 1
    }
}

interface IpropsBar {
    value: number
    idx: number
}

//Bar is FunctionComponenet type with generics IpropsBar interface
const Bar: FC<IpropsBar> = (props) => {
    const { value, idx } = props
    const style = {height: value * 10, transform: `translateX(${idx * 11}px)`}
    return (
        <>
            <div style={style} className='bar'>{value}</div>
            <style jsx> {`
                .bar {
                    position: absolute;
                    widht: 20px;
                    background-color: black;
                }
            `}</style>
        </>
    )
}

const Named = () => {

    const [arr, setArr] = useState(getArr())

    const handleShuffle = () => {
        setArr(getArr)
    }

    const handleSort = () => {
        //Mutable way will change the state, but not come out change result into the web because even though the data is changed, the arr's address is same
        //setArr() will not render if the arr has the same address when it first rendered.
        //So we did Immutable way, like declaring a new array and copying the same data
        //Then setArr() will render the new arr because the new arr has a different address
        //React will understand current object's reference and new object's reference will not same, so render to the web.
        const sortedArr = [...arr]
        sort(sortedArr)
        setArr(sortedArr)
    }
    
    return (
        <div>
            <div className='board'>
                
                {arr.map((value, i) => <Bar key={i} value={value} idx={i}/>)}

            </div>
 
            <div className='buttonBox'>
                <button onClick={handleShuffle}>shuffle</button>
                <button onClick={handleSort}>sort</button>
            </div>
            

            <style jsx>{`
                .board {
                    width: 100%;
                    height: 200px;
                    background-color: green;
                    color: white;
                    transform: rotateX(180deg);
                }
                .buttonBox {
                    width: 100%;
                    height: 60px;
                    background-color: gray;
                    text-align: right;
                }
                button {
                    font-size: 40px;
                }
                
            `}
            </style>
        </div>
    )
}

export default Named