import React from 'react';

type EightBitInputProps = {
    className?: string;
    onChange?: () => void;
};

const EightBitInput = React.forwardRef<HTMLInputElement, EightBitInputProps>(
    ({ className, onChange }, ref) => (
        <input
            type="number"
            min="0"
            max="255"
            className={className}
            ref={ref}
            onChange={onChange}
        />
    )
);

EightBitInput.displayName = 'EightBitInput';

export default EightBitInput;
