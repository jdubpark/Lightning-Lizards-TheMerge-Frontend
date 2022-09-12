import { FC, useEffect, useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';

type BasicNotificationProps = {
    notifications: string[];
};

export const BasicNotfication: FC<BasicNotificationProps> = ({
    notifications,
}) => {
    const [showNotifications, setShowNotifications] = useState(
        new Array(notifications.length).fill(true)
    );

    useEffect(() => {
        if (showNotifications) {
            const showNotificationTimeout = setTimeout(() => {
                setShowNotifications(
                    new Array(notifications.length).fill(false)
                );
            }, 5000);
            return () => clearTimeout(showNotificationTimeout);
        }
    }, []);

    return (
        <div className="fixed bottom-0 left-0 right-0 bottom-5 x-50 z-50">
            <div className="flex flex-col gap-y-3 justify-center items-center w-fit mx-auto">
                {notifications.map((text, index) => {
                    if (!showNotifications[index]) return null;

                    return (
                        <div
                            key={index}
                            className="flex flex-row gap-x-2 md:gap-x-5 justify-between w-full items-center px-5 py-5 mx-auto text-white text md:text-xl bg-black/70 rounded-lg"
                        >
                            <div>{text}</div>
                            <button
                                onClick={() => {
                                    const newShowNotification = [
                                        ...showNotifications,
                                    ];
                                    newShowNotification[index] = false;
                                    setShowNotifications([
                                        ...newShowNotification,
                                    ]);
                                }}
                            >
                                <MdOutlineClose />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
