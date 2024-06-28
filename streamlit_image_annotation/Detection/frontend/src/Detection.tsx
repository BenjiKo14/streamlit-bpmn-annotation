import {
  Streamlit,
  withStreamlitConnection,
  ComponentProps
} from "streamlit-component-lib"
import React, { useEffect, useState } from "react"
import { ChakraProvider, Select, Box, Spacer, HStack, Center, Button, Text, VStack } from '@chakra-ui/react'

import useImage from 'use-image';

import ThemeSwitcher from './ThemeSwitcher'

import BBoxCanvas from "./BBoxCanvas";

export interface PythonArgs {
  image_url: string,
  image_size: number[],
  label_list: string[],
  bbox_info: any[],
  color_map: any,
  line_width: number,
  use_space: boolean
}

const Detection = ({ args, theme }: ComponentProps) => {
  const {
    image_url,
    image_size,
    label_list,
    bbox_info,
    color_map,
    line_width,
    use_space
  }: PythonArgs = args

  const params = new URLSearchParams(window.location.search);
  const baseUrl = params.get('streamlitUrl')
  const [image] = useImage(baseUrl + image_url)

  const [rectangles, setRectangles] = React.useState(
    bbox_info.map((bb, i) => {
      return {
        x: bb.bbox[0],
        y: bb.bbox[1],
        width: bb.bbox[2],
        height: bb.bbox[3],
        label: bb.label,
        stroke: color_map[bb.label],
        id: 'bbox-' + i
      }
    }));
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [label, setLabel] = useState(label_list[0])
  const [mode, setMode] = React.useState<string>('Modify');
  const [undoStack, setUndoStack] = React.useState<any[]>([]);

  const handleClassSelectorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLabel(event.target.value)
    if (!(selectedId === null)) {
      const rects = rectangles.slice();
      for (let i = 0; i < rects.length; i++) {
        if (rects[i].id === selectedId) {
          rects[i].label = event.target.value;
          rects[i].stroke = color_map[rects[i].label]
        }
      }
      setRectangles(rects)
    }
  }
  const [scale, setScale] = useState(1.0)
  useEffect(() => {
    const resizeCanvas = () => {
      const scale_ratio = window.innerWidth * 0.8 / image_size[0]
      setScale(Math.min(scale_ratio, 1.0))
      Streamlit.setFrameHeight(image_size[1] * Math.min(scale_ratio, 1.0))
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas()
  }, [image_size])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (use_space && event.key === ' ') {
        const currentBboxValue = rectangles.map((rect, i) => {
          return {
            bbox: [rect.x, rect.y, rect.width, rect.height],
            label_id: label_list.indexOf(rect.label),
            label: rect.label
          }
        })
        Streamlit.setComponentValue(currentBboxValue)
      } else if (event.key === 'Delete' && selectedId !== null) {
        handleDelete();
      } else if (event.ctrlKey && event.key === 'z') {
        handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [rectangles, selectedId, undoStack]);

  const handleDelete = () => {
    if (selectedId !== null) {
      const rects = rectangles.slice();
      const index = rects.findIndex(rect => rect.id === selectedId);
      if (index !== -1) {
        setUndoStack([...undoStack, { action: 'delete', rect: rects[index] }]);
        rects.splice(index, 1);
        setRectangles(rects);
        setSelectedId(null);
      }
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastAction = undoStack.pop();
      if (lastAction.action === 'add') {
        const rects = rectangles.filter(rect => rect.id !== lastAction.rect.id);
        setRectangles(rects);
      } else if (lastAction.action === 'delete') {
        setRectangles([...rectangles, lastAction.rect]);
      } else if (lastAction.action === 'move') {
        const rects = rectangles.slice();
        const index = rects.findIndex(rect => rect.id === lastAction.newRect.id);
        if (index !== -1) {
          rects[index] = lastAction.oldRect;
          setRectangles(rects);
        }
      }
      setUndoStack(undoStack);
    }
  };

  return (
    <ChakraProvider>
      <ThemeSwitcher theme={theme}>
        <Center>
          <HStack>
            <Box width="80%">
              <BBoxCanvas
                rectangles={rectangles}
                mode={mode}
                selectedId={selectedId}
                scale={scale}
                setSelectedId={setSelectedId}
                setRectangles={setRectangles}
                setLabel={setLabel}
                color_map={color_map}
                label={label}
                image={image}
                image_size={image_size}
                strokeWidth={line_width}
                undoStack={undoStack}
                setUndoStack={setUndoStack}
              />
            </Box>
            <Spacer />
            <VStack>
              <Box>
                <Text fontSize='sm'>Mode</Text>
                <HStack spacing="10px">
                  <Button
                    colorScheme={mode === 'Add' ? 'blue' : undefined}
                    onClick={() => setMode('Add')}
                  >
                    Add
                  </Button>
                  <Button
                    colorScheme={mode === 'Modify' ? 'blue' : undefined}
                    onClick={() => setMode('Modify')}
                  >
                    Modify
                  </Button>
                </HStack>
                <Text fontSize='sm'>Class</Text>
                <Select value={label} onChange={handleClassSelectorChange}>
                  {label_list.map(
                    (l) =>
                      <option key={l} value={l}>{l}</option>
                  )
                  }
                </Select>

                <Button mt="4" colorScheme="green" onClick={() => {
                  const currentBboxValue = rectangles.map((rect, i) => {
                    return {
                      bbox: [rect.x, rect.y, rect.width, rect.height],
                      label_id: label_list.indexOf(rect.label),
                      label: rect.label
                    }
                  })
                  Streamlit.setComponentValue(currentBboxValue)
                }}>Accept modification</Button>
              </Box>
              <Box position="fixed" bottom="10px">
                <HStack spacing="10px" mt="10px">
                  <Button onClick={handleDelete} colorScheme="red">Delete</Button>
                  <Button onClick={handleUndo}>Undo</Button>
                </HStack>
              </Box>
            </VStack>
          </HStack>
        </Center>
      </ThemeSwitcher>
    </ChakraProvider>
  )
}

export default withStreamlitConnection(Detection)
