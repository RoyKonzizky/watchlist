import {useState} from "react";
import {Modal} from "./Modal.tsx";

interface ListNameDialogProps {
    title: string;
    submitLabel: string;
    initialName?: string;
    takenNames?: string[];
    onSubmit: (name: string) => void;
    onClose: () => void;
}

const MAX_LENGTH = 34;

export function ListNameDialog({
                                   title,
                                   submitLabel,
                                   initialName = '',
                                   takenNames = [],
                                   onSubmit,
                                   onClose,
                               }: ListNameDialogProps) {
    const [name, setName] = useState(initialName);

    const trimmed = name.trim();
    const isTaken = takenNames.some((taken) => taken.trim() === trimmed);
    const canSubmit = trimmed.length > 0 && !isTaken;

    return (
        <Modal title={title} onClose={onClose} width={420}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if (canSubmit) onSubmit(trimmed);
                }}
                className="px-6 pb-6"
            >
                <p className={`text-xs ${isTaken ? 'text-red-600' : 'text-slate-400'}`}>
                    לא ניתן להזין שם רשימה קיים
                </p>

                <input
                    autoFocus
                    value={name}
                    maxLength={MAX_LENGTH}
                    onChange={(event) => setName(event.target.value)}
                    aria-invalid={isTaken}
                    className={`mt-6 w-full border-b bg-transparent pb-2 text-center text-lg
                        outline-none transition-colors ${
                        isTaken ? 'border-red-400' : 'border-slate-300 focus:border-blue-600'
                    }`}
                />

                {/* The counter is latin, so it keeps its own direction. */}
                <div className="mt-1.5 text-xs text-slate-400">
                    <bdi>{name.length}/{MAX_LENGTH}</bdi>
                </div>

                <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`mt-8 rounded-lg px-8 py-2.5 text-sm text-white transition-colors ${
                        canSubmit
                            ? 'cursor-pointer bg-blue-600 hover:bg-blue-700'
                            : 'cursor-not-allowed bg-slate-300'
                    }`}
                >
                    {submitLabel}
                </button>
            </form>
        </Modal>
    );
}