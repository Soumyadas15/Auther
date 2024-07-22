interface AppearanceCardItemProps{
    type: 'light' | 'dark';
}

export const AppearanceCardItem = ({
    type,
} : AppearanceCardItemProps) => {

    return (
        <div className={`w-full p-2 rounded-lg
            ${type === 'light' ? 'bg-white' : 'bg-neutral-950'}
            flex flex-col items-start gap-2
        `}>
            <div className={`h-2 w-20 rounded-md ${type === 'light' ? 'bg-neutral-400' : 'bg-neutral-900'}`}></div>
            <div className={`h-2 w-16 rounded-md ${type === 'light' ? 'bg-neutral-400' : 'bg-neutral-900'}`}></div>
        </div>
    )
}