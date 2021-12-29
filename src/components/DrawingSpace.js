import React, { useEffect, useRef, useState } from 'react';
import './assets/DrawingSpace.css';


function DrawingSpace(){
    //atributos por default al iniciar el componente
    const canvasRef = useRef(null);
    //const gridRef = useRef(null);
    const canvasCtxRef = useRef(null);
    //const gridCtxRef = useRef(null);
    const [scale, setScale] = useState("20px");
    //const [width, setWidth] = useState("320px");
    //const [height, setHeight] = useState("320px");
    const [isDrawing, setIsDrawing] = useState(false);
    const [lineWidth, setLineWidth] = useState(5);
    const [lineColor, setLineColor] = useState("black");
    const [lineOpacity, setLineOpacity] = useState(0.1);

    //inicializacion cuando el componente se monta por primera vez
    useEffect(() => {
        const canvas = canvasRef.current;
        //canvas.width = width;
        //canvas.height = height;
        //canvasRef.current = canvas;

        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = lineOpacity;
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        canvasCtxRef.current = ctx;
    }, [lineWidth, lineColor, lineOpacity]);
/*
    useEffect(() => {
        const grid = gridRef.current;
        grid.width = width;
        grid.height = height;
        gridRef.current = grid;

        const ctx = grid.getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        for(var x = 0; x <= width; x += scale){
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
		}
        ctx.stroke();
        for(var y = 0; x <= height; y += scale){
			ctx.moveTo(y, 0);
			ctx.lineTo(y, width);
		}
        ctx.stroke();
        ctx.closePath();

        gridCtxRef.current = ctx;
    }, [width, height, scale]);

    const startCanvas = () => {
        //canvasCtxRef.current.clearRect(0, 0, width, height);
    };

    const startGrid = () => {
        //gridCtxRef.current.clearRect(0, 0, width, height);
    };
    */

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
            <canvas 
            ref={canvasRef}
            width={`320px`} 
            height={`320px`}
            onMouseDown={startDrawing}
            onMouseUp={endDrawing}
            onMouseMove={draw}
            />
            
        </div>
    );
}

export default DrawingSpace;