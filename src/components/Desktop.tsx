import React, { useState } from 'react';
import {
    Mshearts1,
    Notepad, 
    Phone2
} from "@react95/icons";

interface DesktopProps {
    actions: {
        [appName: string]: () => void;
    };
}

export default function Desktop(props : DesktopProps) {
    const handleOpenBlog = props.actions['Blog'];
    const handleOpenContact = props.actions['Contact'];
    const handleOpenGames = props.actions['Games'];
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
                <p>Games</p>
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
        </div>
    );
    
}