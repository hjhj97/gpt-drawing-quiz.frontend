import React, { useEffect } from "react";
import { useCanvas } from "../hooks/useCanvas";
import { CanvasController } from "./CanvasController";
import CanvasBottomText from "./CanvasBottomText";

interface CanvasProps {
  width?: number;
  height?: number;
}

const Canvas: React.FC<CanvasProps> = ({ width = 800, height = 600 }) => {
  const {
    canvasRef,
    currentColor,
    drawingMode,
    startDrawing,
    draw,
    setCurrentColor,
    toggleMode,
    saveImage,
    clearCanvas,
    sendImage,
    message,
    isMessageLoading,
    handleMouseUp,
    undo,
  } = useCanvas({ width, height });

  return (
    <div className="flex flex-col gap-4">
      <h1>Canvas</h1>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`
          border border-gray-300 rounded-lg
          ${drawingMode === "erase" ? "cursor-cell" : "cursor-crosshair"}
        `}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
      />
      <CanvasController
        currentColor={currentColor}
        drawingMode={drawingMode}
        setCurrentColor={setCurrentColor}
        toggleMode={toggleMode}
        saveImage={saveImage}
        sendImage={sendImage}
        isMessageLoading={isMessageLoading}
        clearCanvas={clearCanvas}
        undo={undo}
      />
      <CanvasBottomText message={message} isMessageLoading={isMessageLoading} />
    </div>
  );
};

export default Canvas;
