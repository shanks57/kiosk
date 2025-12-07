import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return <img {...props} src="/assets/logo.svg" alt="App Logo" />;
}
