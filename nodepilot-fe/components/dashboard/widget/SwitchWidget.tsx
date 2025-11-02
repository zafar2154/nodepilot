"use client";

// 1. Hapus 'useState' and 'useEffect'
// State (isOn) sekarang akan datang dari props (induk)
interface SwitchWidgetProps {
    ws: WebSocket | null;
    deviceId: number; // Ini adalah ID internal dari database
    isOn: boolean;    // 2. Tambahkan 'isOn' sebagai prop
}

export default function SwitchWidget({ ws, deviceId, isOn }: SwitchWidgetProps) {
    // 3. Hapus state internal: const [isOn, setIsOn] = useState(false);

    const toggleSwitch = () => {
        const newState = !isOn; // Gunakan 'isOn' dari props

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    type: "set_device_state",
                    // Backend (index.js) mengharapkan ID internal
                    deviceId: deviceId,
                    value: newState ? "on" : "off",
                })
            );
        }
    };

    // 4. Hapus seluruh 'useEffect' dan 'ws.onmessage' dari sini.
    //    Induknya (Widget.tsx) yang akan menangani penerimaan data.

    return (
        <div className="flex flex-col items-center space-y-2 select-none">
            <span className="text-gray-700 dark:text-gray-200">Switch</span>
            <button
                onClick={toggleSwitch}
                // 5. Gunakan 'isOn' dari props untuk menentukan style
                className={`relative w-14 h-8 rounded-full transition-all duration-300 ${isOn ? "bg-green-500" : "bg-gray-500"
                    }`}
            >
                <div
                    // 6. Gunakan 'isOn' dari props untuk menentukan style
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOn ? "translate-x-6" : ""
                        }`}
                />
            </button>
        </div>
    );
}

