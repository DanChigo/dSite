import React from 'react';
import { Modal, List, TitleBar, Frame} from "@react95/core";
import { Awfxex32Info } from "@react95/icons";
import researchPoster from '../images/research_poster.png';
import { useWindowSize } from './WindowSizeProvider';

export default function About(props: {show : boolean, toggle: () => void}) {
    const { isMobile, isTablet } = useWindowSize();
    const showAbout = props.show;
    const toggleAbout = props.toggle;

    const getModalDimensions = () => {
        if (isMobile) {
            return { width: "80vw", height: "70vh" };
        } else if (isTablet) {
            return { width: "70vw", height: "80vh" };
        } else {
            return { width: "500px", height: "600px" };
        }
    };

    const handleCloseAbout = () => {
        toggleAbout();
    };

    const { width, height } = getModalDimensions();
    const screenW = isMobile ? 10 : window.innerWidth * 0.06;
    const screenH = isMobile ? 10 : 20;

    return (
        <>
        {showAbout &&
            // @ts-ignore - React95 Modal has incorrect type definitions
            <Modal
                width={width}
                height={height}
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
                                        <p>I was a summer 2025 AI/ML Engineering intern at CNA Financial Corporation. My main project concerned developing, optimizing,
                                            and deploying an AI Agent to assiste executives in the company. The problem the agent was designed to alleviate
                                            was the overwhelming amount of monthly reports executives have to comb through to keep up with the state of the company.
                                            The reports were nearly 400+ pages long and contained their teams updates on critical accounts. 
                                        </p>
                                        <p>
                                            The agent was built with SharePointAgent, and we used Prompt Engineering techniques to take the agents
                                            performance from 60% to 90% accuracy. A drag in the development process was the manual testing that had to be
                                            done to validate the agents performance. I personally developed an automated testing framework using Playwright
                                            and TypeScript. This allowed us to run 20 queries in only 5 minutes a task that would have taken 2-3 hours manually. 
                                        </p>
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
                                        <h3>🔒 Hardware Optimization DP-SGD</h3>
                                        <p>This was a research project I did during the 2024-2025 school year</p>
                                        <img src={researchPoster} alt="Hardware Optimization DP-SGD"/>
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
