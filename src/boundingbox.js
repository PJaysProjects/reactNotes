import React, { useState, useRef, useEffect } from 'react';

const BoundingRectangle = () => {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    setStartX(e.clientX - canvasRef.current.getBoundingClientRect().left);
    setStartY(e.clientY - canvasRef.current.getBoundingClientRect().top);
    console.log('handleMouseDown')
  };

  const handleMouseMove = (e) => {
    //guard clause
    if (!isDrawing) return;
    setEndX(e.clientX - canvasRef.current.getBoundingClientRect().left);
    setEndY(e.clientY - canvasRef.current.getBoundingClientRect().top);

    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.strokeStyle = 'blue';
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
    console.log('handleMouseMove')
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    console.log('handleMouseUp')
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: '1px solid black' }}
      />
    </div>
  );
}

export default BoundingRectangle;
