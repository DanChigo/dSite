import React from 'react';
import { Modal, List, TitleBar, Frame} from "@react95/core";
import { Awfxex32Info } from "@react95/icons";

export default function About(props: {show : boolean, toggle: () => void}) {
    const showAbout = props.show;
    const toggleAbout = props.toggle;

    const handleCloseAbout = () => {
        toggleAbout();
    };

    const screenW = window.innerWidth * 0.06;
    const screenH = -20;

    return (
        <>
        {showAbout &&
            // @ts-ignore - React95 Modal has incorrect type definitions
            <Modal
                width="500px"
                height="600px"
                icon={<Awfxex32Info variant="32x32_4" />}
                title="About Me"
                dragOptions={{ defaultPosition: { x: screenW, y: screenH } }}
                titleBarOptions={[
                    <TitleBar.Help
                        key="help"
                        onClick={() => {
                            alert("help!")
                        }}/>,
                    <Modal.Minimize key="minimize"/>,
                    <TitleBar.Close key="close" onClick={handleCloseAbout}/>
                ]}
                menu={[
                    {
                        name:(
                            <>
                            <u>F</u>ile
                            </>
                        ),
                        list: (
                            <List width="200px" className="dropdown-menu">
                                <List.Item key="copy-item">Copy</List.Item>
                            </List>
                        )
                    }
                ]}
                >
                    <Frame height="92%" bgColor="white" boxshadow="$in">
                        <div className="about-container">
                            <div className="about-content">
                                <section className="bio">
                                    <p>Hello! I'm Danielle Ejiogu, a software developer with experience in Agile design,
                                        full-stack development, and AI agents. I love to create efficient solutions to 
                                        complex problems. I'm about to graduate university and am open to new opportunities. Beyond coding, I enjoy hiking, reading, writing, and talking to new people!
                                    </p>
                                </section>
                                <section className="projects">
                                    <h2>Projects</h2>
                                    
                                    <div className="project-item">
                                        <h3>🤖 MARP Agent</h3>
                                        <p>An AI agent system designed for multi-agent reinforcement learning. Built using Python and TensorFlow, this project explores cooperative and competitive behaviors in artificial intelligence environments.</p>
                                    </div>

                                    <div className="project-item">
                                        <h3>🌊 Project oCEANIC</h3>
                                        <p> I served as a research fellow on a project led by Dr. Katie Jarriel focused on developing a computational model of Micronesian
                                            navigational practices. The central question was: How can traditional navigation practices build community resilience and 
                                            interconnectivity in the time of climate change and post-pandemic disruption? As a member of the team we developed a new methodology combining 
                                            Indigenous knowledge, computer models, and data analysis to build a model for stakeholders (academics, and actual navigators) to use. The model was
                                            built using Python using Pandas and MesaGeo. 
                                        </p>
                                        <p>
                                            We then presented our initial findings to stakeholders at University of Hawaii at Hilo during a trip to Hawaii in Summer 2024. During that
                                            trip we were able to meet with actual navigators and validate the model with their live feedback. We then developed a website 
                                            using an Agile workflow to make the model accessible to our stakeholders off the mainland. The website was built with React with a Flask server. 
                                            The model can be found <a href="https://project-oceanic.vercel.app" target="_blank" rel="noopener noreferrer">here</a>.
                                        </p>
                                    </div>

                                    <div className="project-item">
                                        <h3>🔒 DP-SGD</h3>
                                        <p>Implementation of Differentially Private Stochastic Gradient Descent for privacy-preserving machine learning. Focuses on maintaining model accuracy while protecting individual data privacy.</p>
                                    </div>
                                </section>

                           
                            </div>

                        </div>
                    </Frame>
                </Modal>

            }

        </>
    );
}
