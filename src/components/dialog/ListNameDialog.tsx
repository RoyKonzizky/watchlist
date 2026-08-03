import {useState} from "react";
import {Modal} from "../Modal.tsx";

interface ListNameDialogProps {
    title: string;
    submitLabel: string;
    initialName?: string;
    takenNames?: string[];
    onSubmit: (name: string) => void;
    onClose: () => void;
}

const MAX_LENGTH = 16;

export function ListNameDialog({
                                   title,
                                   submitLabel,
                                   initialName = '',
                                   takenNames = [],
                                   onSubmit,
                                   onClose,
                               }: ListNameDialogProps) {
    const [name, setName] = useState(initialName);
    const [didAttemptSubmit, setDidAttemptSubmit] = useState(false);

    const trimmed = name.trim();
    const isTaken = takenNames.some((taken) => taken.trim() === trimmed);
    const canSubmit = trimmed.length > 0 && !isTaken;
    const showTakenWarning = didAttemptSubmit && isTaken;

    return (
        <Modal title={title} onClose={onClose} width={340} height="auto">
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    setDidAttemptSubmit(true);
                    if (canSubmit) onSubmit(trimmed);
                }}
                className="px-4 pb-6"
            >
                <p className={`text-right text-xs ${showTakenWarning ? 'text-red-600' : 'text-slate-400'}`}>
                    {showTakenWarning
                        ? 'לא ניתן להזין שם רשימה קיים'
                        : 'לאיזה שם תרצו לשנות?'}
                </p>

                <input
                    autoFocus
                    value={name}
                    maxLength={MAX_LENGTH}
                    onChange={(event) => {
                        setName(event.target.value);
                        setDidAttemptSubmit(false);
                    }}
                    aria-invalid={showTakenWarning}
                    className={`mt-6 w-full border-b bg-transparent pb-2 text-center text-lg
                        outline-none transition-colors ${
                        showTakenWarning ? 'border-red-400' : 'border-slate-300'
                    }`}
                />

                <div className="mt-1.5 text-xs text-slate-400">
                    <bdi>{name.length}/{MAX_LENGTH}</bdi>
                </div>

                <button
                    type="submit"
                    disabled={trimmed.length === 0}
                    className={`mt-8 rounded-lg px-8 py-2.5 text-sm text-white transition-colors ${
                        trimmed.length > 0
                            ? 'cursor-pointer bg-[#070757] hover:bg-[#070757]/90'
                            : 'cursor-not-allowed bg-slate-300'
                    }`}
                >
                    {submitLabel}
                </button>
            </form>
        </Modal>
    );
}
