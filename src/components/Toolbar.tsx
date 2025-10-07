import React from 'react';
import { ReaderClosed } from '@react95/icons';
import { TaskBar, List } from '@react95/core';

// @ts-ignore
function Toolbar() {
    return (
    <TaskBar list={<List>
              <List.Item icon={<ReaderClosed variant="32x32_4" />}>
                Local Disk (C:)
              </List.Item>
            </List>} />
    )
}

export default Toolbar;