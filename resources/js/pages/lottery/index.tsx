import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useState } from 'react';

// Utility to generate random 4 digits
function generateDigits() {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
}

export default function Lottery() {
    const [digits, setDigits] = useState([1, 1, 1, 1]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showWinner, setShowWinner] = useState(false);
    const [winnerCode, setWinnerCode] = useState('');

    const rollingSound = new Audio('/sounds/rolling.mp3');
    const stopSound = new Audio('/sounds/stop.mp3');

    const startDraw = () => {
        setIsAnimating(true);
        setShowWinner(false);

        rollingSound.loop = true;
        rollingSound.play();

        const interval = setInterval(() => {
            setDigits(generateDigits());
        }, 80);

        setTimeout(() => {
            clearInterval(interval);
            stopSound.play();
            rollingSound.pause();
            rollingSound.currentTime = 0;

            const finalDigits = generateDigits();
            setDigits(finalDigits);
            setWinnerCode(finalDigits.join(''));
            setIsAnimating(false);
            setShowWinner(true);
        }, 2500);
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center space-y-10 bg-black p-6 text-white">
            <h1 className="text-4xl font-bold tracking-wider text-yellow-400">
                APLI AWARDS
            </h1>
            <p className="-mt-4 text-lg text-gray-300">
                Entrepreneur of the Year 2025
            </p>

            <Card className="rounded-2xl border-4 border-yellow-500 bg-zinc-900 p-6 shadow-xl">
                <CardContent>
                    <div className="flex space-x-6">
                        {digits.map((digit, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    y: isAnimating ? [0, -5, 5, 0] : 0,
                                }}
                                transition={{
                                    repeat: isAnimating ? Infinity : 0,
                                    duration: 0.2,
                                }}
                                className="flex h-28 w-20 items-center justify-center rounded-xl bg-white text-5xl font-extrabold text-black shadow-lg"
                            >
                                <motion.span
                                    animate={{
                                        y: isAnimating ? [0, -5, 5, 0] : 0,
                                    }}
                                    transition={{
                                        repeat: isAnimating ? Infinity : 0,
                                        duration: 0.2,
                                    }}
                                >
                                    {digit}
                                </motion.span>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Button
                onClick={startDraw}
                className="rounded-xl bg-yellow-500 px-10 py-6 text-xl font-semibold text-black hover:bg-yellow-600"
            >
                Start Draw
            </Button>

            {showWinner && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70">
                    <Card className="animate-in rounded-2xl bg-white p-10 text-center text-black shadow-xl duration-300 fade-in zoom-in">
                        <h2 className="mb-4 text-3xl font-bold">Winner!</h2>
                        <p className="mb-6 font-mono text-6xl font-extrabold">
                            {winnerCode}
                        </p>
                        <Button
                            onClick={() => setShowWinner(false)}
                            className="rounded-xl bg-yellow-500 px-6 py-3 text-lg text-black hover:bg-yellow-600"
                        >
                            Close
                        </Button>
                    </Card>
                </div>
            )}
            <div className="w-full bg-white px-6 py-8 shadow-inner">
                <div className="mx-auto max-w-6xl space-y-6 text-center text-black">
                    <h3 className="text-lg font-semibold text-gray-700">
                        Sponsored by
                    </h3>
                    <div className="flex flex-wrap items-center justify-center gap-10 opacity-90">
                        <img src="https://placehold.co/100" className="h-10" />
                        <img src="https://placehold.co/100" className="h-10" />
                        <img src="https://placehold.co/100" className="h-10" />
                        <img src="https://placehold.co/100" className="h-10" />
                        <img src="https://placehold.co/100" className="h-10" />
                        <img src="https://placehold.co/100" className="h-10" />
                    </div>

                    <h3 className="mt-6 text-lg font-semibold text-gray-700">
                        Supported by
                    </h3>
                    <div className="flex flex-wrap items-center justify-center gap-10 opacity-90">
                        <img src="https://placehold.co/100" className="h-10" />
                        <img src="https://placehold.co/100" className="h-10" />
                        <img src="https://placehold.co/100" className="h-10" />
                        <img src="https://placehold.co/100" className="h-10" />
                        <img src="https://placehold.co/100" className="h-10" />
                        <img src="https://placehold.co/100" className="h-10" />
                        <img src="https://placehold.co/100" className="h-10" />
                        <img src="https://placehold.co/100" className="h-10" />
                    </div>

                    <div className="mt-10 flex items-center justify-between px-4 text-sm text-gray-600">
                        <div>
                            <span className="block font-semibold text-gray-700">
                                Event Venue By
                            </span>
                            <img
                                src="https://placehold.co/100"
                                className="mt-2 h-14"
                            />
                        </div>
                        <div className="text-right">
                            <span className="block font-semibold text-gray-700">
                                This Event Powered by
                            </span>
                            <img
                                src="https://placehold.co/100"
                                className="mt-2 h-10"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
