import React, { useEffect, useRef, useState } from 'react';
import './assets/DrawingSpace.css';
import ToolBar from './ToolBar';
import TopBar from './TopBar';


function DrawingSpace(){
    //atributos por default al iniciar el componente
    const canvasRef = useRef(null);
    const gridRef = useRef(null);
    const canvasCtxRef = useRef(null);
    const gridCtxRef = useRef(null);
    const auxCanvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lineWidth, setLineWidth] = useState(1);
    const [lineColor, setLineColor] = useState("#000000");
    const [tool, setTool] = useState("brush");
    const [gridOn, setGridOn] = useState(true);
    const [frameCount, setFrameCount] = useState(1);
    const [rowCount, setRowCount] = useState(1);
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const newWidth = useRef(16);
    const newHeight = useRef(16);
    const copyActive = useRef(false);
    const stampActive = useRef(false);

    //controladores de cambio en el canvas y grid
    useEffect(() => {
        const canvas = canvasRef.current;
        let canvasData = canvas.toDataURL();
        canvas.width = frameCount * newWidth.current * 20; //20 escala default
        canvas.height = rowCount * newHeight.current * 20; //20 escala default
        document.getElementById("spacer").style.width = canvas.width + 'px';
        document.getElementById("spacer").style.height = canvas.height + 'px';

        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        canvasCtxRef.current = ctx;
        drawSavedCanvas(canvasData);
        
    }, [lineWidth, lineColor, frameCount, rowCount]);

    useEffect(() => {
        if(!gridOn){
            gridRef.current.style.opacity = "0";
        }else{
            gridRef.current.style.opacity = "1";
        }

        const grid = gridRef.current;
        grid.width = frameCount * newWidth.current * 20; //20 escala default
        grid.height = rowCount * newHeight.current * 20; //20 escala default

        const ctx = grid.getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.8;
        for(let x = 0; x <= grid.width; x += 20){
			ctx.moveTo(x, 0);
			ctx.lineTo(x, grid.height);
		}
        ctx.stroke();
        for(let y = 0; y <= grid.height; y += 20){
			ctx.moveTo(0, y);
			ctx.lineTo(grid.width, y);
		}
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath()
        ctx.strokeStyle = "blue";
        
        for(let x = 0; x <= grid.width; x += (newWidth.current*20)){
            ctx.moveTo(x, 0);
            ctx.lineTo(x, grid.height);
        }

        for(let y = 0; y <= grid.height; y += (newHeight.current*20)){
            ctx.moveTo(0, y);
            ctx.lineTo(grid.width, y);
        }

        ctx.stroke();
        ctx.closePath();

        gridCtxRef.current = ctx;

    }, [gridOn, frameCount, rowCount]);
    

    //funciones de dibujado en canvas
    const startDrawing = (e) => {
        canvasCtxRef.current.beginPath();
        canvasCtxRef.current.moveTo(
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY
        );
        setIsDrawing(true);
    };

    const endDrawing = (e) => {
        switch(tool){
            case "filler":
                let image = canvasCtxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
                let pixelData = canvasCtxRef.current.getImageData(e.nativeEvent.offsetX, e.nativeEvent.offsetY, 1, 1).data;
                let numPixels = image.data.length / 4;
                const hexToRgbA = (hex) => {
                    let c;
                    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
                        c= hex.substring(1).split('');
                        if(c.length === 3){
                            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
                        }
                        c= '0x'+c.join('');
                        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
                    }
                    throw new Error('Bad Hex');
                }

                let currentColor = hexToRgbA(lineColor).slice(5, hexToRgbA(lineColor).length -1);
                let currentR = currentColor.split(',')[0];
                let currentG = currentColor.split(',')[1];
                let currentB = currentColor.split(',')[2];

                const matchStartColor = (pixelPos) => {
                    return (pixelData[0] === image.data[pixelPos * 4] && pixelData[1] === image.data[pixelPos * 4 + 1] && pixelData[2] === image.data[pixelPos * 4 + 2] && pixelData[3] === image.data[pixelPos * 4 + 3])
                }

                const colorPixel = (pixelPos) => {
                    image.data[pixelPos * 4] = currentR;
                    image.data[pixelPos * 4 + 1] = currentG;
                    image.data[pixelPos * 4 + 2] = currentB;
                    image.data[pixelPos * 4 + 3] = 255;
                }
                
                for(let i = 0; i < numPixels; i++){
                    if(matchStartColor(i)){
                        colorPixel(i);
                    }
                }

                canvasCtxRef.current.putImageData(image, 0, 0);
                break;
            
            case "copy":
                if(copyActive.current){
                    let copiedImg = new Image();
                    copiedImg.src = document.getElementById("auxCanvas").toDataURL();
                    copiedImg.onload = () => {
                        canvasCtxRef.current.drawImage(copiedImg, Math.floor(e.nativeEvent.offsetX / (newWidth.current*20)) * newWidth.current*20, Math.floor(e.nativeEvent.offsetY / (newHeight.current*20)) * newHeight.current*20);
                        auxCanvasRef.current.getContext("2d").clearRect(0, 0, newWidth.current*20, newHeight.current*20);
                    };
                }else{
                    let auxCanvas = auxCanvasRef.current;
                    auxCanvas.width = newWidth.current*20;
                    auxCanvas.height = newHeight.current*20;
                    let copiedImg = new Image();
                    copiedImg.src = canvasRef.current.toDataURL();

                    copiedImg.onload = () => {
                        auxCanvas.getContext("2d").drawImage(copiedImg, Math.floor(e.nativeEvent.offsetX / (newWidth.current*20)) * newWidth.current*20, Math.floor(e.nativeEvent.offsetY / (newHeight.current*20)) * newHeight.current*20, newWidth.current*20, newHeight.current*20, 0, 0, newWidth.current*20, newHeight.current*20);
                        copyActive.current = true; 
                    };
                }
                break;

            case "stamp":

                break;

            default:
                break;
        }

        canvasCtxRef.current.closePath();
        setIsDrawing(false);
        recordAction();
    };

    const draw = (e) => {
        if(!isDrawing){
            return;
        }

        switch(tool){
            case "brush":
                if(e.touches == null){
                    canvasCtxRef.current.lineTo(
                        e.nativeEvent.offsetX,
                        e.nativeEvent.offsetY
                    );
                }else{
                    canvasCtxRef.current.lineTo(
                        e.touches[0].clientX-canvasRef.current.offsetLeft,
                        e.touches[0].clientY-canvasRef.current.offsetTop
                    );
                }
                canvasCtxRef.current.stroke();
                break;
            case "pencil":
                    canvasCtxRef.current.fillStyle = lineColor;
                    if(e.touches == null){
                        canvasCtxRef.current.fillRect(Math.floor(e.nativeEvent.offsetX / 20) * 20, Math.floor(e.nativeEvent.offsetY / 20) * 20, 20, 20);
                    }else{
                        let x = e.touches[0].clientX - canvasRef.current.offsetLeft;
                        let y = e.touches[0].clientY - canvasRef.current.offsetTop;
                        canvasCtxRef.current.fillRect(Math.floor(x / 20) * 20, Math.floor(y / 20) * 20, 20, 20);
                    }
                    break;
            case "eraser":
                    canvasCtxRef.current.fillStyle = "rgba(255, 255, 255, 255)";
                    if(e.touches == null){
                        canvasCtxRef.current.fillRect(e.nativeEvent.offsetX - (lineWidth/2), e.nativeEvent.offsetY - (lineWidth/2), lineWidth, lineWidth);
                    }else{
                        let x = e.touches[0].clientX - canvasRef.current.offsetLeft;
                        let y = e.touches[0].clientY - canvasRef.current.offsetTop;
                        canvasCtxRef.current.fillRect(x - (lineWidth/ 2), y - (lineWidth/ 2), 20, 20);
                    }
                    break;
            default:
                break;
        }
        
    };

    //funciones de manipulacion de datos del canvas
    const drawSavedCanvas = (canvasData) => {
        let canvasImg = new Image();
        canvasImg.src = canvasData;
        canvasImg.onload = () => {
            canvasCtxRef.current.drawImage(canvasImg, 0, 0);
        }
    }

    const recordAction = () => {
        undoStack.push(canvasCtxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
        setRedoStack([])
        setUndoStack(undoStack);
    };

    window.onload = recordAction;

    return (
        <div className="drawingSpace">
            <TopBar 
            setFrameCount={setFrameCount}
            setRowCount={setRowCount}
            frameCount={frameCount}
            rowCount={rowCount}
            setUndoStack={setUndoStack}
            setRedoStack={setRedoStack}
            undoStack={undoStack}
            redoStack={redoStack}
            canvasRef={canvasRef}
            canvasCtxRef={canvasCtxRef}
            />

            <canvas id="mainCanvas"
            ref={canvasRef}
            width={`320px`} 
            height={`320px`}
            />
            
            <canvas id="gridCanvas"
            ref={gridRef} 
            width={`320px`}
            height={`320px`}
            onMouseDown={startDrawing}
            onTouchStart={startDrawing}
            onMouseUp={endDrawing}
            onMouseMove={draw}
            onTouchMove={draw}
            />

            <canvas id='auxCanvas'
            ref={auxCanvasRef}
            width={`320px`}
            height={`320px`}
            />
            <div id='spacer'/>

            <ToolBar 
            setLineColor={setLineColor}
            setLineWidth={setLineWidth}
            setTool={setTool}
            setGridOn={setGridOn}
            newWidth={newWidth}
            newHeight={newHeight}
            canvasRef={canvasRef}
            setFrameCount={setFrameCount}
            setRowCount={setRowCount}
            setUndoStack={setUndoStack}
            setRedoStack={setRedoStack}
            />
        </div>
    );
}

export default DrawingSpace;