import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import './assets/TopBar.css';

function TopBar({setFrameCount, setRowCount, frameCount, rowCount}) {
    const [frames, setFrames] = useState([1]);

    return (
        <div className="topBar fixed-top">
            <ButtonGroup id="topBarButtonGroup" vertical>
                <ButtonGroup size="lg">
                <Button variant="secondary" onClick={() => {
                                                if(frameCount > 1){
                                                    let i = frameCount - 1;
                                                    setFrameCount(i);

                                                    let newFramesList = [...frames];
                                                    newFramesList.splice(frameCount-1, 1);
                                                    setFrames(newFramesList);
                                                }
                                            }}>Remove Frame</Button>
                <Button variant="secondary" onClick={() => {
                                                let i = frameCount + 1;
                                                setFrameCount(i);
                                                setFrames([...frames, i]);
                                            }}>Add Frame</Button>

                <ButtonGroup vertical>
                    <Button variant="secondary" onClick={() => {
                                                if(rowCount > 1){
                                                    let i = rowCount - 1;
                                                    setRowCount(i);
                                                }
                                            }}>Remove Row</Button>
                    <Button variant="secondary" onClick={() => {
                                                let i = rowCount + 1;
                                                setRowCount(i);
                                            }}>Add Row</Button>
                </ButtonGroup>
                </ButtonGroup>
            </ButtonGroup>

            <div id="framesBar">
                <ButtonGroup size="sm">
                {frames.map((frame, index) => (
                    <Button variant='dark' index={index}>{frame}</Button>
                ))}
                </ButtonGroup>
            </div>

            <div id="undoRedo">
                <ButtonGroup>
                <Button variant='secondary'>undo</Button>
                <Button variant='secondary'>redo</Button>
                </ButtonGroup>
            </div>
        </div>
    );  
}

export default TopBar;