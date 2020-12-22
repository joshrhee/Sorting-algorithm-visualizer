//There will be ... in-front-of 'lodash' if Typescript could not figure out the lodash library. Then, do the below at the terminal
//command: yarn add @types/lodash  "@types/"" means lodash for typescript version
import { range, shuffle, sortBy, values, uniqueId } from 'lodash'
import { resolve } from 'path'
import { Dispatch, FC, SetStateAction, useState, memo, MutableRefObject, useEffect, useRef } from 'react'
//Animation Library
//command: yarn add tweening-js
import { tween } from 'tweening-js'
//Sound Library
//command: yarn add browser-beep
import browserBeep from 'browser-beep'

const DURATION = 60 //duration is  millisecond
const SIZE = 30
const BAR_WIDTH = 20
const BAR_MARGIN = 2

const getArr = () => shuffle(range(1, SIZE + 1))
const initArr = range(1, SIZE + 1).map(() => 1)
const getX = (idx: number) => idx * (BAR_MARGIN + BAR_WIDTH)



const swap = (arr: IExtendedBar[], a: number, b: number) => {
    let temp = arr[a]
    arr[a] = arr[b]
    arr[b] = temp
}

type TSetIdx = Dispatch<SetStateAction<Number>>
type TSetX = Dispatch<SetStateAction<number>>



interface IExtendedBar {
    value: number
    refSetX: MutableRefObject<TSetX>
  }

const sort = async (extendedBarArr: IExtendedBar[], setIdxI: TSetIdx, setIdxJ: TSetIdx) => {
    const beepA = browserBeep({ frequency: 830 })  
    const beepB = browserBeep({ frequency: 230 })

    let i = 1, j = 1
    while (i < extendedBarArr.length) {
        await tween(j, i, setIdxJ, DURATION).promise()
        j = i
        while (j > 0 && extendedBarArr[j - 1].value > extendedBarArr[j].value) {
            beepA(1)
            await Promise.all([
                tween(getX(j), getX(j-1), extendedBarArr[j].refSetX.current, DURATION).promise(),
                tween(getX(j - 1), getX(j), extendedBarArr[j-1].refSetX.current, DURATION).promise(),
            ])
            swap(extendedBarArr, j, j - 1)

            await tween(j, j - 1, setIdxJ, DURATION).promise()
            j = j - 1
            
        }
        beepB(1)
        await tween(i, i + 1, setIdxI, DURATION).promise()
        i = i + 1 
    }
}



interface IpropsBar {
    value: number
    idx: number
    refSetX: MutableRefObject<TSetX>
}

//Bar is FunctionComponenet type with generics IpropsBar interface
const Bar: FC<IpropsBar> = (props) => {
    const { value, idx, refSetX } = props
    const [x, setX] = useState(getX(idx))
    const style = { height: value * 10, transform: `translateX(${x}px)` }
    refSetX.current = setX
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

interface IpropsBoard {
    arr: number[]
    refExtendedBarArr: MutableRefObject<IExtendedBar[]>
}

//Use when arr is changed. We don't have to render if arr is not changed.
//If we click buttons except shuffle, sort, we don't have to render.
const isEqualArr = (oldProps: IpropsBoard, props: IpropsBoard) => {
    if (oldProps.arr !== props.arr) {
        console.log(props.arr.join(','))
    }
    //check old props and current props are equal or not
    //Render if below result is false
    return oldProps.arr === props.arr 
}

const Board: FC<IpropsBoard> = (props) => {
    const { arr, refExtendedBarArr } = props
    const extendedBarArr = arr.map(value => ({ value, refSetX: useRef<TSetX>(null) }))
    useEffect(() => {
        refExtendedBarArr.current = extendedBarArr
    }, [arr])

    return (
        <div className='board'>
            {extendedBarArr.map((item, i) => {
                //uniqueId is just to make sure match right array number with bar
                //If I did not do that, sometimes bug happended
                return <Bar key={ `${uniqueId(`set`)}: ${i}` } value={item.value} idx={i} refSetX={item.refSetX}/>
            })}
            <style jsx> {`
                .board {
                    width: 100%;
                    height: 200px;
                    background-color: green;
                    color: white;
                    transform: rotateX(180deg);
                }
            `}

            </style>
        </div>
    )
}

const MemorizedBoard = memo(Board, isEqualArr)

const Named = () => {

    const [arr, setArr] = useState(initArr)
    const [idxI, setIdxI] = useState(1)
    const [idxJ, setIdxJ] = useState(1)
    const [isRunning, setIsRunning] = useState(false)
    const refExtendedBarArr = useRef<IExtendedBar[]>([])
    useEffect(() => setArr(getArr()), [])

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
        await sort(refExtendedBarArr.current, setIdxI, setIdxJ)
        setIsRunning(false) //Like the buttonBox div, when setIsRunning becomes false, shuffle, sort button will be re appeared.
    }
    
    return (
        <div>
            <MemorizedBoard arr={arr} refExtendedBarArr={refExtendedBarArr}/>
            <div className='index i' style={{ transform: `translateX(${getX(idxI)}px)` }}>i</div>
            <div className='index j' style={{ transform: `translateX(${getX(idxJ)}px)` }}>i</div>
            

            <div className='buttonBox'>
                { !isRunning && <button onClick={handleShuffle}>shuffle</button> }
                { !isRunning && <button onClick={handleSort}>sort</button> }
                { isRunning && <div className='running'>Sorting!!!</div> }
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