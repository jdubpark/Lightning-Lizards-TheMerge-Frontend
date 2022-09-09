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
    children: JSX.Element | JSX.Element[];
    name: string;
    isDisabled?: boolean;
    onClick?: () => void;
}

export function PixelInfoSection({
    children,
    name,
    isDisabled,
    onClick,
}: PixelInfoSectionProps) {
    return (
        <div
            onClick={onClick}
            className={`py-4 px-6 bg-white rounded-lg shadow-xl overflow-hidden ${
                isDisabled
                    ? 'pointer-events-none hidden'
                    : 'pointer-events-auto'
            } ${onClick ? 'cursor-pointer' : 'cursor-auto'}`}
        >
            <div className="text-lg font-bold text-center">{name}</div>
            <div className="flex flex-col space-y-2 pt-2">{children}</div>
        </div>
    );
}
