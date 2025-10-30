import React from 'react';
//import { useEffect, useState } from "react";
import { Modal, List, Frame, TitleBar, Tooltip } from "@react95/core";
import { Phone2 } from "@react95/icons";
import { useWindowSize } from './WindowSizeProvider';

export default function Contact(props: {show : boolean, toggle: () => void}) {
    const showContact = props.show;
    const toggleContact = props.toggle;
    const { isMobile, isTablet } = useWindowSize();

    const handleCloseContact = () => {
        toggleContact();
    };

    const getModalDimensions = () => {
        if (isMobile) {
            return { width: "80vw", height: "25vh", listWidth: "70vw" };
        } else if (isTablet) {
            return { width: "60vw", height: "40vh", listWidth: "50vw" };
        } else {
            return { width: "400px", height: "300px", listWidth: "200px" };
        }     
    };

    const { width, height, listWidth } = getModalDimensions();

    const screenW = window.innerWidth * 0.06;
    const screenH = -20;

    return (
        <>
        {showContact &&
            // @ts-ignore - React95 Modal has incorrect type definitions
            <Modal
                width={width}
                height={height}
                icon={<Phone2 variant="32x32_4" />}
                title="Contact Me!"
                dragOptions={{
                    defaultPosition: { x: screenW, y: screenH }
                }}
                titleBarOptions={[
                    <TitleBar.Help
                        key="help"
                        onClick={() => {
                            alert("help!")
                        }}/>,
                    <Modal.Minimize key="minimize"/>,
                    <TitleBar.Close key="close" onClick={handleCloseContact}/>
                ]}
                menu={[
                    {
                        name:(
                            <>
                            <u>F</u>ile
                            </>
                        ),
                        list: (
                            <List width={listWidth} className="dropdown-menu">
                                <List.Item key="copy-item">Copy</List.Item>
                            </List>
                        )
                    }
                ]}
            >
                <Frame w="100%" h="100%" bgColor="white" boxshadow="$in">
                    <div className="contact-info">
                        <p>Feel free to reach out!</p>
                        <p>
                            Email: {" "}
                            <a href="mailto:ejiogu53@gmail.com">
                                ejiogu53@gmail.com
                            </a>
                        </p>
                        <p>
                            My social medias:
                        </p>
                        <div>
                            <Tooltip delay={500} text="Github">
                                <a
                                    href="https://github.com/DanChigo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src="./github-logo.png"
                                        alt="Github"
                                        style={{ width: "25px" }}
                                    />
                                </a>
                            </Tooltip>
                        </div>
                    </div>
                </Frame>
            </Modal>
        }
        </>
    );
}