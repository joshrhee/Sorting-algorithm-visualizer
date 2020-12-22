//There will be ... in-front-of 'lodash' if Typescript could not figure out the lodash library. Then, do the below at the terminal
//command: yarn add @types/lodash
import { range, shuffle, sortBy, values } from 'lodash'
import { resolve } from 'path'
import { Dispatch, FC, SetStateAction, useState } from 'react'

const DURATION = 20 //duration is  millisecond
const SIZE = 10
const BAR_WIDTH = 20
const BAR_MARGIN = 2

const getArr = () => shuffle(range(1, SIZE + 1))
const getX = (idx: number) => idx * (BAR_MARGIN + BAR_WIDTH)



const swap = (arr: number[], a: number, b: number) => {
    let temp = arr[a]
    arr[a] = arr[b]
    arr[b] = temp
}

type TSetArr = Dispatch<SetStateAction<Number[]>>
type TSetIdx = Dispatch<SetStateAction<Number>>
type TSet = Dispatch<SetStateAction<any>>

const delaySet = (value: any, setArr: TSet) => new Promise((resolve) => {
    setArr(value)  //declaring a new array and cloning the arr's data (...arr) to render setArr
    setTimeout(resolve, DURATION)
})

const sort = async (arr: number[], setArr: TSetArr, setIdxI: TSetIdx, setIdxJ: TSetIdx) => {
    let i = 1
    while (i < arr.length) {
        let j = i
        await delaySet(j, setIdxJ)
        while (j > 0 && arr[j - 1] > arr[j]) {
            swap(arr, j, j - 1)
            await delaySet([...arr], setArr)
            j = j - 1
            await delaySet(j, setIdxJ)
        }
        i = i + 1 
        await delaySet(i, setIdxI)
    }
}



interface IpropsBar {
    value: number
    idx: number
}

//Bar is FunctionComponenet type with generics IpropsBar interface
const Bar: FC<IpropsBar> = (props) => {
    const { value, idx } = props
    const style = {height: value * 10, transform: `translateX(${getX(idx)}px)`}
    return (
        <>
            <div style={style} className='bar'>!!</div>
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
    const [idxI, setIdxI] = useState(1)
    const [idxJ, setIdxJ] = useState(1)
    const [isRunning, setIsRunning] = useState(false)

    const handleShuffle = () => {
        setArr(getArr)
        setIdxI(1)
        setIdxJ(1)
    }

    const handleSort = async () => {
        //Mutable way will change the state, but not come out change result into the web because even though the data is changed, the arr's address is same
        //setArr() will not render if the arr has the same address when it first rendered.
        //So we did Immutable way, like declaring a new array and copying the same data
        //Then setArr() will render the new arr because the new arr has a different address
        //React will understand current object's reference and new object's reference will not same, so render to the web.
        setIsRunning(true) //Like the buttonBox div, we will make to visualize if isRunning is false
        await sort(arr, setArr, setIdxI, setIdxJ)
        setIsRunning(false) //Like the buttonBox div, when setIsRunning becomes false, shuffle, sort button will be re appeared.
    }
    
    return (
        <div>
            <div className='board'>
                
                {arr.map((value, i) => <Bar key={i} value={value} idx={i}/>)}

            </div>

            <div className='index i' style={{ transform: `translateX(${getX(idxI)}px)` }}>i</div>
            <div className='index j' style={{ transform: `translateX(${getX(idxJ)}px)` }}>i</div>
            

            <div className='buttonBox'>
                { !isRunning && <button onClick={handleShuffle}>shuffle</button> }
                { !isRunning && <button onClick={handleSort}>sort</button> }
                { isRunning && <div className='running'>Running...</div> }
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
                .running {
                    font-size: 40px;
                }
                .index {
                    position: absoulte;
                    width: 20px;
                    color: white;
                    opacity: 0.8; 투명도
                }
                .index.j {
                    background-color: blue;
                    color: white;
                }
                .index.i {
                    background-color: yellow;
                    color: black;
                }
                
            `}
            </style>
        </div>
    )
}

export default Named