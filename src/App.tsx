import Contact from './components/Contact';
import Euchre from './components/Euchre/Euchre';
import About from './components/About';
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
        About: false,
        Euchre: false,
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
                'About': () => handleOpenWindow('About'),
                'Euchre': () => handleOpenWindow('Euchre'),
            }}/>
            <Euchre 
                show={showWindow.Euchre}
                toggle={() => toggleWindow('Euchre', !showWindow.Euchre)}
            />
            <Contact
                show={showWindow.Contact}
                toggle={() => toggleWindow('Contact', !showWindow.Contact)}
            />
            <Blog
                show={showWindow.Blog}
                toggle={() => toggleWindow('Blog', !showWindow.Blog)}
            />
            <About
                show={showWindow.About}
                toggle={() => toggleWindow('About', !showWindow.About)}
            />
        </WindowSizeProvider>
        </>
    )


}

export default App;