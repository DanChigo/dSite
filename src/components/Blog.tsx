import React from 'react';
import { Modal, List, Frame, TitleBar, Tooltip } from "@react95/core";
import { Notepad } from "@react95/icons";
// @ts-ignore

function Blog(props: {show : boolean, toggle: () => void}) {
    const showBlog = props.show;
    const toggleBlog = props.toggle;

    const handleCloseBlog = () => {
        toggleBlog();
    }

    const screenW = window.innerWidth * 0.06;
    const screenH = -20;

    return (
        <>
        {
          showBlog &&
           // @ts-ignore - React95 Modal has incorrect type definitions
          <Modal
            width="600px"
            height="600px"
            icon={<Notepad variant="32x32_4" />}
            title="Blog"
            dragOptions={{
              defaultPosition: { x: screenW, y: screenH }
            }}
            titleBarOptions={[
              <TitleBar.Help
                key="help"
                onClick={() => {
                  alert("help!")
                }}/>,
              <Modal.Minimize key="minimize" />,
              <TitleBar.Close key="close" onClick={handleCloseBlog} />
            ]}
          >
            sup
          </Modal>
        }
      </>
    )
    
}

export default Blog;