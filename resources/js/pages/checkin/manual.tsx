import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useRef, useState } from 'react';
import Keyboard from 'react-simple-keyboard';

// Instead of the default import, you can also use this:
// import { KeyboardReact as Keyboard } from "react-simple-keyboard"
import 'react-simple-keyboard/build/css/index.css';

export default function ManualPage() {
    const [layoutName, setLayoutName] = useState('default');
    const [code, setCode] = useState('');
    const keyboard = useRef(null);

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     try {
    //         const res = await axios.post('/checkin', { code });
    //         toast.success(res.data.message || 'Checked in successfully');
    //         setCode('');
    //     } catch (err: any) {
    //         toast.error(err.response?.data?.message || 'Check-in failed');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const onChangeAll = (inputs: any) => {
    //     /**
    //      * Here we spread the inputs into a new object
    //      * If we modify the same object, react will not trigger a re-render
    //      */
    //     setInputs({ ...inputs });
    //     console.log('Inputs changed', inputs);
    // };

    const handleShift = () => {
        const newLayoutName = layoutName === 'default' ? 'shift' : 'default';
        setLayoutName(newLayoutName);
    };

    const onKeyPress = (button: string) => {
        console.log('Button pressed', button);

        /**
         * If you want to handle the shift and caps lock buttons
         */
        if (button === '{shift}' || button === '{lock}') handleShift();
    };

    // const onChangeInput = (event) => {
    //     const inputVal = event.target.value;

    //     setInputs({
    //         ...inputs,
    //         [inputName]: inputVal,
    //     });

    //     keyboard.current.setInput(inputVal);
    // };

    // const getInputValue = (inputName) => {
    //     return inputs[inputName] || '';
    // };

    return (
        <div className="bg-foreground/10">
            <div className="relative mx-auto flex h-screen w-full max-w-md items-center justify-center bg-white">
                <div className="flex flex-col gap-4">
                    <h4 className="text-center text-2xl font-mediu text-black">
                        Input Invitation Code
                    </h4>
                    <Input name="code_invitation" type="text" value={code} onChange={e => setCode(e.target.value)} className='text-black' />
                    <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        className="rounded-sm bg-primary dark:bg-primary-foreground text-white"
                    >
                        Konfirmasi
                    </Button>
                </div>

                <div className="absolute bottom-0 grid h-[20vh] w-full grid-cols-2 bg-white px-6 py-4">
                    <div className="m-auto flex h-full flex-col justify-between gap-3">
                        <p className="text-xs text-black">
                            Masukkan kode secara manual jika{' '}
                            <strong>QR Code tidak terbaca.</strong>
                        </p>
                        <Link href="/checkin/scan">
                            <Button className="w-fit" variant="outline">
                                Check In QR
                            </Button>
                        </Link>
                        <div className="flex items-center justify-between bg-white">
                            <p className="text-xs font-medium dark:text-secondary">
                                This Ticketing System <br /> Powered by
                            </p>
                            <img
                                className="h-4 w-auto"
                                src="/assets/icon.svg"
                                alt="tron-logo"
                            />
                        </div>
                    </div>
                    <div className="px-6">
                        <Link href="/checkin/scan">
                            <Button className="flex h-full w-full flex-col items-center justify-center rounded-none bg-primary dark:bg-primary-foreground">
                                <p className="text-lg font-medium text-white dark:text-foreground">
                                    Scan QR
                                </p>
                                <img
                                    className="h-20 w-20"
                                    src="/assets/hand-scan.svg"
                                    alt="scan-qr"
                                />
                                <ChevronDown size={16} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="absolute hidden bottom-[10vh] left-1/2 md:flex w-3/4 -translate-x-1/2 transform px-4">
                <Keyboard
                    keyboardRef={(r) => (keyboard.current = r)}
                    layoutName={layoutName}
                    onChangeAll={(inp) => setCode(inp['default'])}
                    onKeyPress={(button) =>
                        console.log('Button pressed', button)
                    }
                />
            </div>
        </div>
    );
}
