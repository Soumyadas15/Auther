import { AppearanceCardItem } from "./appearance-card-item"
import { AppearanceCardSubitem } from "./appearance-card-subitem"

interface AppearanceCardProps{
    type: 'light' | 'dark',
    onClick: () => void;
    isSelected: boolean;
}

export const AppearanceCard = ({
    type,
    onClick,
    isSelected
} : AppearanceCardProps) => {

    return (
        <div className="flex flex-col items-center gap-2" onClick={onClick}>
            <div className={`w-[14rem] h-[10rem] rounded-md transition duration-300
                    border-[2px] border-neutral-100 dark:border-neutral-900  p-1 cursor-pointer
                    ${isSelected ? 'border-neutral-900 dark:border-neutral-100' : ''}
            `}>
                <div className={`w-full h-full rounded-md p-2 flex flex-col justify-between
                                ${type === 'light' ? 'bg-neutral-400' : 'bg-neutral-900'}
                `}>
                    <AppearanceCardItem type={type}/>
                    <AppearanceCardSubitem type={type}/>
                    <AppearanceCardSubitem type={type}/>
                </div>
            </div>
            <p className="text-sm font-light">{type === 'light' ? 'Light' : 'Dark'}</p>
        </div>
        
    )
}