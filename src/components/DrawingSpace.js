import React, { useEffect, useRef, useState } from 'react';
import './assets/DrawingSpace.css';


function DrawingSpace(){
    //atributos por default al iniciar el componente
    const canvasRef = useRef(null);
    const gridRef = useRef(null);
    const canvasCtxRef = useRef(null);
    const gridCtxRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lineWidth, setLineWidth] = useState(5);
    const [lineColor, setLineColor] = useState("black");

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
        canvasCtxRef.current.lineTo(
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY
        );

        canvasCtxRef.current.stroke();
    }

    return (
        <div className="drawingSpace">
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
            onMouseUp={endDrawing}
            onMouseOut={endDrawing}
            onMouseMove={draw}
            />
        </div>
    );
}

export default DrawingSpace;