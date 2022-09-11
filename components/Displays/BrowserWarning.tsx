import clsx from 'clsx';
import { browserName, browserVersion } from 'react-device-detect';

export function BrowserCheck({}) {
    if (browserName === 'Safari') {
        return (
            <div className="flex flex-col items-center justify-center py-1 px-2 text-sm bg-eth-gray text-white font-semibold rounded text-center">
                <div className="text-2xl font-semibold text-center">
                    Please use Chrome or Firefox to view this site.
                </div>
                <div className="text-2xl font-semibold text-center">
                    Safari is not supported.
                </div>
            </div>
        );
    }
    return <div></div>;
}
