"use client"

import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { useCallback, useEffect, useState } from "react";

interface ModalProps {
    title?: string;
    description?: string;
    currentStep?: number;
    totalSteps?: number; 
    isOpen? : boolean;
    onClose?: () => void;
    onSubmit: () => void;
    body?: React.ReactElement;
    footer?: React.ReactElement;
    actionLabel?: string;
    disabled?: boolean;
    secondaryAction?: () => void;
    secondaryActionLabel?: string;
    actionLabelVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export const Modal = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    description,
    body,
    footer,
    actionLabel,
    disabled,
    secondaryAction,
    actionLabelVariant = 'default',
    secondaryActionLabel,
}: ModalProps) => {

    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div>
                    {body}
                </div>

                <DialogFooter className="gap-2">
                    {secondaryActionLabel && (
                        <Button 
                            className="w-full"
                            variant={'outline'} onClick={secondaryAction}
                            disabled={disabled}
                        >
                            {secondaryActionLabel}
                        </Button>
                    )}
                    <Button 
                        className="w-full"
                        //@ts-ignore
                        variant={actionLabelVariant} 
                        onClick={onSubmit}
                        disabled={disabled}
                    >
                        {actionLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}