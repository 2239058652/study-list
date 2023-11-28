import React, { useState, useContext } from 'react'

type ContextType = { count: number, setCount: React.Dispatch<React.SetStateAction<number>> }
export const AppContext = React.createContext<ContextType>({} as ContextType)
export const LevelA: React.FC = () => {
    const [count, setCount] = useState(0)

    return (
        <div style={{ backgroundColor: 'lightblue', padding: 30, width: '50vw' }}>
            <p>count值是：{count}</p>
            <button onClick={() => setCount((prev) => prev + 1)}>+1</button>

            <AppContext.Provider value={{ count, setCount }}>
                <LevelB />
            </AppContext.Provider>
        </div>
    )
}

export const LevelB: React.FC = () => {
    return (
        <div style={{ backgroundColor: 'lightgreen', padding: 30 }}>
            <LevelC />
        </div>
    )
}

export const LevelC: React.FC = () => {
    const ctx = useContext(AppContext)
    console.log('ctx', ctx)

    return (
        <div style={{ backgroundColor: 'lightsalmon', padding: 30 }}>
            <button>+1</button>
            <button>重置</button>
        </div>
    )
}

