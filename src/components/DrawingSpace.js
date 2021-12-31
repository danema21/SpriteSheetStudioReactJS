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
    const [isDrawing, setIsDrawing] = useState(false);
    const [lineWidth, setLineWidth] = useState(5);
    const [lineColor, setLineColor] = useState("black");
    const [tool, setTool] = useState("brush");

    //inicializacion cuando el componente se monta por primera vez
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        canvasCtxRef.current = ctx;
    }, [lineWidth, lineColor]);

    useEffect(() => {
        const grid = gridRef.current;

        const ctx = grid.getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        for(var x = 0; x <= canvasRef.current.width; x += 20){
			ctx.moveTo(x, 0);
			ctx.lineTo(x, canvasRef.current.width);
		}
        ctx.stroke();
        for(var y = 0; y <= canvasRef.current.height; y += 20){
			ctx.moveTo(0, y);
			ctx.lineTo(canvasRef.current.height, y);
		}
        ctx.stroke();
        ctx.closePath();

        gridCtxRef.current = ctx;
    }, []);
    

    //funciones de dibujado en canvas
    const startDrawing = (e) => {
        canvasCtxRef.current.beginPath();
        canvasCtxRef.current.moveTo(
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY
        );
        setIsDrawing(true);
    };

    const endDrawing = () => {
        canvasCtxRef.current.closePath();
        setIsDrawing(false);
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
            case "filler":
                    /* falta implementar (complejidad muy alta)
                    let pixelData = canvasCtxRef.current.getImageData(e.nativeEvent.offsetX, e.nativeEvent.offsetY, 1, 1).data;
                    let currentFillColor = lineColor.slice(5, lineColor.length-1);
                    let fillColorR = currentFillColor.split(',')[0];
                    let fillColorG = currentFillColor.split(',')[1];
                    let fillColorB = currentFillColor.split(',')[2];
                    
                    let startR = pixelData[0];
                    let startG = pixelData[1];
                    let startB = pixelData[2];

                    let newPos, x, y, pixelPos;
                    let colorLayer = canvasCtxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);

                    let pixelStack = [[e.nativeEvent.offsetX, e.nativeEvent.offsetY]];

                    const matchStartColor = (pixelPos) => {
                        let r = colorLayer.data[pixelPos];
                        let g = colorLayer.data[pixelPos + 1];
                        let b = colorLayer.data[pixelPos + 2];

                        return (r === startR && g === startG && b === startB);
                    }

                    const colorPixel = (pixelPos) => {
                        colorLayer.data[pixelPos] = fillColorR;
                        colorLayer.data[pixelPos + 1] = fillColorG;
                        colorLayer.data[pixelPos + 2] = fillColorB;
                        colorLayer.data[pixelPos + 3] = 255;
                    }
                    let i = 0;
                    while(i < 1000){
                        i++;
                        newPos = pixelStack.pop();
                        x = newPos[0];
                        y = newPos[1];

                        pixelPos = (y * canvasRef.current.width + x) * 4;
                        while(y-- >= 0 && matchStartColor(pixelPos)){
                            pixelPos -= canvasRef.current.width * 4;
                        }

                        pixelPos += canvasRef.current.width * 4;
                        ++y;
                        let reachLeft = false;
                        let reachRight = false;
                        while(y++ < canvasRef.current.height - 1 && matchStartColor(pixelPos)){
                            colorPixel(pixelPos);
                            
                            if(x > 0){
                                if(matchStartColor(pixelPos - 4)){
                                    if(!reachLeft){
                                        pixelStack.push([x-1, y]);
                                        reachLeft = true;
                                    }else if(reachLeft){
                                        reachLeft = false;
                                    }
                                }
                            }

                            if(x < canvasRef.current.width -1){
                                if(matchStartColor(pixelPos + 4)){
                                    if(!reachRight){
                                        pixelStack.push([x+1, y]);
                                        reachRight = true;
                                    }else if(reachRight){
                                        reachRight = false;
                                    }
                                }
                            }

                            pixelPos += canvasRef.current.width * 4;
                        }
                    }
                    canvasCtxRef.current.putImageData(colorLayer, 0, 0);*/
                    break;
                    
            default:
                break;
        }
        
    };

    return (
        <div className="drawingSpace">
            <TopBar />

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
            onMouseOut={endDrawing}
            onMouseMove={draw}
            onTouchMove={draw}
            />

            <ToolBar 
            setLineColor={setLineColor}
            setLineWidth={setLineWidth}
            setTool={setTool}
            />
        </div>
    );
}

export default DrawingSpace;