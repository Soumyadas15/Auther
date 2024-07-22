interface AppearanceCardSubitemProps{
    type: 'light' | 'dark';
}

export const AppearanceCardSubitem = ({
    type,
} : AppearanceCardSubitemProps) => {

    return (
        <div className={`w-full p-2 rounded-lg
            ${type === 'light' ? 'bg-white' : 'bg-neutral-950'}
            flex items-center gap-2
        `}>
            <div className={`h-6 w-6 rounded-full ${type === 'light' ? 'bg-neutral-400' : 'bg-neutral-900'}`}></div>
            <div className={`h-2 w-16 rounded-md ${type === 'light' ? 'bg-neutral-400' : 'bg-neutral-900'}`}></div>
        </div>
    )
}