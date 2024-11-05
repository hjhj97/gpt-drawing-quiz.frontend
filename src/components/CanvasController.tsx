import React from "react";
import { COLORS } from "../hooks/useCanvas";

interface ColorButtonProps {
  color: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const ColorButton: React.FC<ColorButtonProps> = ({
  color,
  isSelected,
  onClick,
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      w-8 h-8 rounded-full transition-all
      ${isSelected ? "ring-2 ring-offset-2 ring-gray-400" : ""}
      ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
    `}
    style={{ backgroundColor: color }}
    aria-label={`Select ${color} color`}
  />
);

interface CanvasControllerProps {
  currentColor: string;
  drawingMode: "draw" | "erase";
  setCurrentColor: (color: string) => void;
  toggleMode: () => void;
  saveImage: () => void;
  clearCanvas: () => void;
  sendImage: () => void;
  isMessageLoading: boolean;
  undo: () => void;
}

export const CanvasController: React.FC<CanvasControllerProps> = ({
  currentColor,
  drawingMode,
  setCurrentColor,
  toggleMode,
  saveImage,
  clearCanvas,
  sendImage,
  isMessageLoading,
  undo,
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="mr-2">색상:</span>
        <div className="flex gap-2">
          {Object.entries(COLORS).map(([name, color]) => (
            <ColorButton
              key={color}
              color={color}
              isSelected={currentColor === color}
              onClick={() => setCurrentColor(color)}
              disabled={drawingMode === "erase"}
            />
          ))}
        </div>
      </div>

      <button
        onClick={toggleMode}
        className={`
          px-4 py-2 rounded-md text-white transition-colors
          ${
            drawingMode === "erase"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }
        `}
      >
        {drawingMode === "draw" ? "지우개 모드" : "그리기 모드"}
      </button>

      <button
        onClick={saveImage}
        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
      >
        이미지 저장
      </button>

      <button
        onClick={clearCanvas}
        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
      >
        전체 지우기
      </button>

      <button
        onClick={sendImage}
        disabled={isMessageLoading}
        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors"
      >
        {isMessageLoading ? "전송중..." : "GPT에 이미지 전송"}
      </button>

      <button
        onClick={undo}
        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
      >
        ↩ 실행 취소
      </button>
    </div>
  );
};
