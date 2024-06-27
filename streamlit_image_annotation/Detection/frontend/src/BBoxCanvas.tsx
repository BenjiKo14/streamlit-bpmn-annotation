import React, { useState, useEffect } from "react";
import { Layer, Rect, Stage, Image } from "react-konva";
import BBox from "./BBox";
import Konva from "konva";

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  stroke: string;
  id: string;
}

export interface BBoxCanvasLayerProps {
  rectangles: Rectangle[];
  mode: string;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  setRectangles: (rectangles: Rectangle[]) => void;
  setLabel: (label: string) => void;
  color_map: { [key: string]: string };
  scale: number;
  label: string;
  image_size: number[];
  image: HTMLImageElement | undefined;
  strokeWidth: number;
  undoStack: any[];
  setUndoStack: (stack: any[]) => void;
}

const BBoxCanvas = (props: BBoxCanvasLayerProps) => {
  const {
    rectangles,
    mode,
    selectedId,
    setSelectedId,
    setRectangles,
    setLabel,
    color_map,
    scale,
    label,
    image_size,
    image,
    strokeWidth,
    undoStack,
    setUndoStack,
  }: BBoxCanvasLayerProps = props;
  const [adding, setAdding] = useState<number[] | null>(null);

  const checkDeselect = (e: any) => {
    if (!(e.target instanceof Konva.Rect)) {
      if (selectedId === null) {
        if (mode === "Add") {
          const pointer = e.target.getStage().getPointerPosition();
          setAdding([pointer.x, pointer.y, pointer.x, pointer.y]);
        }
      } else {
        setSelectedId(null);
      }
    }
  };

  const isPointInRect = (pointX: number, pointY: number, rect: Rectangle): boolean => {
    return (
      pointX >= rect.x * scale - 5 &&
      pointX <= (rect.x + rect.width) * scale + 5 &&
      pointY >= rect.y * scale - 5 &&
      pointY <= (rect.y + rect.height) * scale + 5
    );
  };

  const getSmallestRectangle = (rect1: Rectangle, rect2: Rectangle): Rectangle => {
    const area1 = rect1.width * rect1.height;
    const area2 = rect2.width * rect2.height;
    return area1 < area2 ? rect1 : rect2;
  };

  const handleStageMouseDown = (e: any) => {
    const pointer = e.target.getStage().getPointerPosition();
    const overlappingRects = rectangles.filter((r) => isPointInRect(pointer.x, pointer.y, r));
    if (mode === "Modify") {
      if (overlappingRects.length > 0) {
        const smallestRect = overlappingRects.reduce((prev, curr) =>
          getSmallestRectangle(prev, curr)
        );
        if (selectedId === smallestRect.id) {
          // If the clicked element is already selected, keep it selected
          setSelectedId(smallestRect.id);
        } else {
          // Otherwise, select the smallest overlapping rectangle
          setSelectedId(smallestRect.id);
          const rects = rectangles.slice();
          const lastIndex = rects.length - 1;
          const lastItem = rects[lastIndex];
          const index = rects.findIndex((r) => r.id === smallestRect.id);
          rects[lastIndex] = rects[index];
          rects[index] = lastItem;
          setRectangles(rects);
          setLabel(smallestRect.label);
        }
      } else {
        setSelectedId(null);
      }
    } else {
      checkDeselect(e);
    }
  };

  useEffect(() => {
    const rects = rectangles.slice();
    for (let i = 0; i < rects.length; i++) {
      if (rects[i].width < 0) {
        rects[i].width = rects[i].width * -1;
        rects[i].x = rects[i].x - rects[i].width;
        setRectangles(rects);
      }
      if (rects[i].height < 0) {
        rects[i].height = rects[i].height * -1;
        rects[i].y = rects[i].y - rects[i].height;
        setRectangles(rects);
      }
      if (rects[i].x < 0 || rects[i].y < 0) {
        rects[i].width = rects[i].width + Math.min(0, rects[i].x);
        rects[i].x = Math.max(0, rects[i].x);
        rects[i].height = rects[i].height + Math.min(0, rects[i].y);
        rects[i].y = Math.max(0, rects[i].y);
        setRectangles(rects);
      }
      if (
        rects[i].x + rects[i].width > image_size[0] ||
        rects[i].y + rects[i].height > image_size[1]
      ) {
        rects[i].width = Math.min(rects[i].width, image_size[0] - rects[i].x);
        rects[i].height = Math.min(rects[i].height, image_size[1] - rects[i].y);
        setRectangles(rects);
      }
      if (rects[i].width < 5 || rects[i].height < 5) {
        rects[i].width = 5;
        rects[i].height = 5;
      }
    }
  }, [rectangles, image_size, setRectangles]);

  const handleClick = (rect: Rectangle) => {
    if (selectedId === rect.id) {
      // If the clicked element is already selected, keep it selected
      setSelectedId(rect.id);
    } else {
      // Otherwise, handle the click logic
      const pointer = {
        x: (rect.x + rect.width / 2) * scale,
        y: (rect.y + rect.height / 2) * scale,
      };
      handleStageMouseDown({ target: { getStage: () => ({ getPointerPosition: () => pointer }) } });
    }
  };

  return (
    <Stage
      width={image_size[0] * scale}
      height={image_size[1] * scale}
      onMouseDown={handleStageMouseDown}
      onMouseMove={(e: any) => {
        if (!(adding === null)) {
          const pointer = e.target.getStage().getPointerPosition();
          setAdding([adding[0], adding[1], pointer.x, pointer.y]);
        }
      }}
      onMouseLeave={(e: any) => {
        setAdding(null);
      }}
      onMouseUp={(e: any) => {
        if (!(adding === null)) {
          const rects = rectangles.slice();
          const new_id = Date.now().toString();
          const newRect = {
            x: adding[0] / scale,
            y: adding[1] / scale,
            width: (adding[2] - adding[0]) / scale,
            height: (adding[3] - adding[1]) / scale,
            label: label,
            stroke: color_map[label],
            id: new_id,
          };
          rects.push(newRect);
          setRectangles(rects);
          setUndoStack([...undoStack, { action: 'add', rect: newRect }]);
          setSelectedId(new_id);
          setAdding(null);
        }
      }}
    >
      <Layer>
        {image && <Image image={image} scaleX={scale} scaleY={scale} />}
      </Layer>
      <Layer>
        {rectangles.map((rect, i) => {
          return (
            <BBox
              key={i}
              rectProps={rect}
              scale={scale}
              strokeWidth={strokeWidth}
              isSelected={mode === "Modify" && rect.id === selectedId}
              onClick={() => handleClick(rect)}
              onChange={(newAttrs: Rectangle) => {
                const rects = rectangles.slice();
                const oldAttrs = { ...rects[i] };
                rects[i] = newAttrs;
                setRectangles(rects);
                setUndoStack([...undoStack, { action: 'move', oldRect: oldAttrs, newRect: newAttrs }]);
              }}
            />
          );
        })}
        {adding !== null && (
          <Rect
            fill={color_map[label] + "4D"}
            x={adding[0]}
            y={adding[1]}
            width={adding[2] - adding[0]}
            height={adding[3] - adding[1]}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default BBoxCanvas;
