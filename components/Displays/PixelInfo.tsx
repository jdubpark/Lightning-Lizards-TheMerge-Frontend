import clsx from 'clsx';

export function InfoItem({
    name,
    value,
}: {
    name: string;
    value: number | string;
}) {
    return (
        <div className="flex space-x-3 items-center">
            <div className="py-1 px-2 text-sm bg-eth-gray text-white font-semibold uppercase rounded text-center">
                {name}
            </div>
            <div>{value}</div>
        </div>
    );
}

interface PixelInfoSectionProps {
    children?: JSX.Element | JSX.Element[];
    name: string | JSX.Element;
    isDisabled?: boolean;
    onClick?: () => void;
    singleItem?: boolean;
    compact?: boolean;
}

export function InfoItemAddress({
    name,
    value,
}: {
    name: string;
    value: number | string;
}) {
    return (
        <div className="flex space-x-3 items-center">
            <div className="py-1 px-2 text-sm bg-eth-gray text-white font-semibold uppercase rounded text-center">
                {name}
            </div>
            <div>
                <a href={`https://etherscan.io/address/${value}`}> {value}</a>
            </div>
        </div>
    );
}

interface PixelInfoSectionProps {
    children?: JSX.Element | JSX.Element[];
    name: string | JSX.Element;
    isDisabled?: boolean;
    onClick?: () => void;
    singleItem?: boolean;
    compact?: boolean;
}

export function PixelInfoSection({
    children,
    name,
    isDisabled,
    onClick,
    singleItem,
    compact,
}: PixelInfoSectionProps) {
    return (
        <div
            onClick={onClick}
            className={clsx(
                'bg-white rounded-lg shadow-xl overflow-hidden flex-none',
                compact ? 'py-3 px-6' : 'py-4 px-6',
                isDisabled
                    ? 'pointer-events-none hidden'
                    : 'pointer-events-auto',
                onClick ? 'cursor-pointer' : 'cursor-auto'
            )}
        >
            <div className="text-lg font-bold text-center">{name}</div>
            {children && (
                <div
                    className={clsx(
                        'flex flex-col pt-2',
                        singleItem ? '' : 'space-y-2'
                    )}
                >
                    {children}
                </div>
            )}
        </div>
    );
}
