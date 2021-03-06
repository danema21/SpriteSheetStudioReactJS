import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/ToolBar.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


function ToolBar({setLineColor, setLineWidth, setTool, setGridOn, newWidth, newHeight, canvasRef, setFrameCount, setRowCount, setUndoStack, setRedoStack}){
    const [newModalShow, setNewModalShow] = useState(false);
    const [openModalShow, setOpenModalShow] = useState(false);
    const [animationModalShow, setAnimationModalShow] = useState(false);
    const [helpModalShow, setHelpModalShow] = useState(false);

    const showNewModal = () => setNewModalShow(true);
    const showOpenModal = () => setOpenModalShow(true);
    const showAnimationModal = () => setAnimationModalShow(true);
    const showHelpModal = () => setHelpModalShow(true);
    const hideNewModal = () => setNewModalShow(false);
    const hideOpenModal = () => setOpenModalShow(false);
    const hideAnimationModal = () => setAnimationModalShow(false);
    const hideHelpModal = () => setHelpModalShow(false);

    const createNewProject = () => {
        hideNewModal();
        canvasRef.current.width = newWidth.current * 20;
        canvasRef.current.height = newHeight.current * 20;
        setFrameCount(1);
        setRowCount(1);
        setUndoStack([canvasRef.current.getContext('2d').getImageData(0 , 0, canvasRef.current.width, canvasRef.current.height)]);
        setRedoStack([]);
        setGridOn(false);
        
    };

    const openProject = (e) => {
        if(e.target.files[0] === undefined){return};
        hideOpenModal();
        let reader = new FileReader();
        reader.onload = (event) => {
            let userImg = new Image();
            userImg.onload = () => {
                canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                canvasRef.current.width = userImg.width;
                canvasRef.current.height = userImg.height;
                canvasRef.current.getContext('2d').drawImage(userImg, 0, 0);
                
                setFrameCount(userImg.width / (newWidth.current*20));
                setRowCount(userImg.height / (newHeight.current*20));
            };
            userImg.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);

        setUndoStack([canvasRef.current.getContext('2d').getImageData(0 , 0, canvasRef.current.width, canvasRef.current.height)]);
        setRedoStack([]);
        setGridOn(false);
    };

    const animationPreview = () => {
        const animCanvas = document.getElementById("animCanvas");
        animCanvas.getContext("2d").clearRect(0, 0, animCanvas.width, animCanvas.height);
        let spriteSheet = new Image();
        spriteSheet.src = canvasRef.current.toDataURL();
        let srcX = 0;
        let srcY = 0;
        let currentFrame = 0;
        let animationBrake = 0;
        let animationInterval = 60;
        let frameWidth = newWidth.current * 20;
        let frameHeight = newHeight.current * 20;
        spriteSheet.onload = () => requestAnimationFrame(animate);
        const updateFrame = () => {
            currentFrame = ++currentFrame % document.getElementById("animFrames").value;
            srcX = frameWidth * currentFrame;
            srcY = (frameHeight *  document.getElementById("animRows").value) - frameHeight;
        };

        const drawFrame = () => {
            updateFrame();
            animCanvas.getContext("2d").drawImage(spriteSheet, srcX, srcY, frameWidth, frameHeight, 0, 0, animCanvas.width, animCanvas.height);
        };

        const animate = () => {
            if(animationBrake > animationInterval){
                animCanvas.getContext("2d").clearRect(0, 0, animCanvas.width, animCanvas.height);
                drawFrame();
                animationBrake = 0;
            }
            animationBrake++;
            animationInterval = 60 - document.getElementById("animSpeed").value;
            if(animationModalShow === true){
                requestAnimationFrame(animate);
            }
        };
    };

    const saveProject = () => {
        let imgUrl = canvasRef.current.toDataURL();
        let tmpLink = document.createElement('a');
        tmpLink.download = 'image.png'
        tmpLink.href = imgUrl;
        document.body.appendChild(tmpLink);
        tmpLink.click();
        document.body.removeChild(tmpLink);
    }

    const reset = () => {
        hideNewModal();
        hideOpenModal();
        newWidth.current = canvasRef.current.width / 20;
        newHeight.current = canvasRef.current.height /20;
    }

    return (
        <div className="toolBar fixed-bottom bg-secondary">
            <Dropdown drop='up'>
                <Dropdown.Toggle variant='secondary'>
                    Tools
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setTool("pencil")}>pencil</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTool("brush")}>brush</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTool("eraser")}>eraser</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTool("filler")}>filler</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTool("copy")}>copy</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTool("stamp")}>stamp</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <input type="color"
            onChange={(e) => {
                setLineColor(e.target.value);
            }}
            ></input>
            <Dropdown drop='up' autoClose='outside'>
                <Dropdown.Toggle variant='secondary'>
                    Tool size
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item>
                        <input type='range'
                            min='1'
                            max='40' 
                            defaultValue='1'
                            onChange={(e) => {
                                setLineWidth(e.target.value);
                            }}
                            ></input>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown drop='up'>
                <Dropdown.Toggle variant='secondary'>
                    Grid
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => {
                        setGridOn(true);
                    }}>
                            Turn On
                    </Dropdown.Item>

                    <Dropdown.Item onClick={() => {
                        setGridOn(false);
                    }}>
                            Turn Off
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown drop='up'>
                <Dropdown.Toggle variant='secondary'>
                    Menu
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={showNewModal}>New...</Dropdown.Item>
                    <Dropdown.Item onClick={showOpenModal}>Open...</Dropdown.Item>
                    <Dropdown.Item onClick={showAnimationModal}>Animation preview</Dropdown.Item>
                    <Dropdown.Item onClick={saveProject}>Save</Dropdown.Item>
                    <Dropdown.Item onClick={showHelpModal}>Help</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <Modal show={newModalShow} onHide={hideNewModal} backdrop="static" centered>
                <Modal.Header>
                    <Modal.Title>Create new proyect</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>Choose the size of the canvas in pixels:</h6>
                    <label>width: <input type="number" onChange={(e) => newWidth.current = e.target.value} className='w-50' min='1' max='32' /></label>
                    <br></br><br></br>
                    <label>height: <input type="number" onChange={(e) => newHeight.current = e.target.value} className='w-50' min='1' max='32' /></label>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={reset} variant='dark'>Cancel</Button>
                    <Button onClick={createNewProject} variant='dark'>Create</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={openModalShow} onHide={hideOpenModal} backdrop="static" centered>
                <Modal.Header>
                    <Modal.Title>Open proyect</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>Set width and height of the grid separator:</h6>
                    <label>width: <input type="number" onChange={(e) => newWidth.current = e.target.value} className='w-50' min='1' max='32' /></label>
                    <br></br><br></br>
                    <label>height: <input type="number" onChange={(e) => newHeight.current = e.target.value} className='w-50' min='1' max='32' /></label>
                    <br></br><br></br>
                    <h6>Choose an image from your device:</h6>
                    <input onChange={openProject} name="imageLoader" type="file" accept="image/*" />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={reset} variant='dark'>Cancel</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={animationModalShow} onHide={hideAnimationModal} backdrop="static" centered>
                <Modal.Header>
                    <Modal.Title>Animation preview</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    <h6>Set the configuration: </h6>
                    <label>frames: <input id="animFrames" type="number" min="1" className='w-25'/></label><br></br>
                    <label>row: <input id="animRows" type="number" min="1" className='w-25'/></label><br></br>
                    <label>speed: <input id="animSpeed" type="number" min="1" max="60" className='w-50'/></label><br></br>
                    <br></br><br></br>
                    <h6>preview of the current row animation:</h6>
                    <canvas id="animCanvas" width={`160px`} height={`160px`}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={hideAnimationModal} variant='dark'>Close</Button>
                    <Button onClick={animationPreview} variant='dark'>Play</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={helpModalShow} onHide={hideHelpModal} backdrop="static" centered>
                <Modal.Header>
                    <Modal.Title>Help video</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <iframe title='helpVid' allow="fullscreen" width="100%" height="210px" src="https://www.youtube.com/embed/NKPKTh-ixiE"></iframe>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={hideHelpModal} variant='dark'>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ToolBar;