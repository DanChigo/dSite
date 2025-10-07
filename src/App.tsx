import Contact from './components/Contact';
import Desktop from './components/Desktop';
import Toolbar  from './components/Toolbar';
import Blog from './components/Blog';
import './App.css';
// @ts-ignore
import '@react95/core/GlobalStyle';
import '@react95/core/themes/win95.css';


import React, {useState} from 'react';
import WindowSizeProvider from './components/WindowSizeProvider';

function App() {
    const [showWindow, setShowWindow] = useState({
        Contact: false,
        Blog: false,
    });

    const toggleWindow = (windowName: string, isVisible: boolean) => {
        setShowWindow((prev) => ({
            ...prev,
            [windowName]: isVisible
        }));
    }

    const handleOpenWindow = (windowName: string) => toggleWindow(windowName, true);

    return (
        <>
        <WindowSizeProvider>
            <Toolbar />
            <Desktop actions={{
                'Contact': () => handleOpenWindow('Contact'),
                'Blog': () => handleOpenWindow('Blog'),
            }}/>
            <Contact
                show={showWindow.Contact}
                toggle={() => toggleWindow('Contact', !showWindow.Contact)}
            />
            <Blog
                show={showWindow.Blog}
                toggle={() => toggleWindow('Blog', !showWindow.Blog)}
            />
        </WindowSizeProvider>
        </>
    )


}

export default App;