import React, { useState } from 'react';
import {
    Mshearts1,
    Notepad, 
    Phone2,
    Awfxex32Info
} from "@react95/icons";

interface DesktopProps {
    actions: {
        [appName: string]: () => void;
    };
}

export default function Desktop(props : DesktopProps) {
    const handleOpenBlog = props.actions['Blog'];
    const handleOpenContact = props.actions['Contact'];
    const handleOpenGames = props.actions['Euchre'];
    const handleOpenAbout = props.actions['About'];
      const [activeIcon, setActiveIcon] = useState<number | null>(null);

    const handleToggleIcon = (iconId: number) => {
        setActiveIcon((prev) => (prev === iconId ? null : iconId));
    };

    return (
        <div className="desktop-icons">
            <div
                className={activeIcon === 1 ? "active-icon" : "inactive-icon"}
                onClick={() => handleToggleIcon(1)}
                onDoubleClick={handleOpenGames}
            >
                <Mshearts1 variant="32x32_4" />
                <p>Play Euchre</p>
            </div>
            <div
                className={activeIcon === 2 ? "active-icon" : "inactive-icon"}
                onClick={() => handleToggleIcon(2)}
                onDoubleClick={handleOpenBlog}
            >
                <Notepad variant="32x32_4" />
                <p>Blog</p>
            </div>
            <div
                className={activeIcon === 3 ? "active-icon" : "inactive-icon"}
                onClick={() => handleToggleIcon(3)}
                onDoubleClick={handleOpenContact}
            >
                <Phone2 variant="32x32_4" />
                <p>Contact</p>
            </div>
            <div
                className={activeIcon === 4 ? "active-icon" : "inactive-icon"}
                onClick={() => handleToggleIcon(4)}
                onDoubleClick={handleOpenAbout}
            >
                <Awfxex32Info variant="32x32_4" />
                <p>About</p>
            </div>
        </div>
    );
    
}