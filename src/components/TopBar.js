import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import './assets/TopBar.css';

function TopBar({setFrameCount, setRowCount, frameCount, rowCount, setUndoStack, setRedoStack, undoStack, redoStack, canvasCtxRef}) {
    const [frames, setFrames] = useState([1]);

    useEffect(() => {
        let newlist = [];
        for(let i = 1; i <= frameCount; i++){
            newlist.push(i);
        }
        setFrames(newlist);
    }, [frameCount, rowCount]);

    const undo = () => {
        if(undoStack.length > 1){
            redoStack.unshift(undoStack.pop())
            setRedoStack(redoStack);
            setUndoStack(undoStack);

            canvasCtxRef.current.putImageData(undoStack[undoStack.length-1], 0, 0);
        }
    };

    const redo = () => {
        if(redoStack.length > 0){
            canvasCtxRef.current.putImageData(redoStack[0], 0, 0);
           
            undoStack.push(redoStack.shift());
            setUndoStack(undoStack);
            setRedoStack(redoStack);
        }
    }

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
                {frames.map((frame, i) => (
                    <Button variant='dark' key={i}>{frame}</Button>
                ))}
                </ButtonGroup>
            </div>

            <div id="undoRedo">
                <ButtonGroup>
                <Button variant='secondary' onClick={undo}>undo</Button>
                <Button variant='secondary' onClick={redo}>redo</Button>
                </ButtonGroup>
            </div>
        </div>
    );  
}

export default TopBar;