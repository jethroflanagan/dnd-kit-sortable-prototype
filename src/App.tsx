import { useMediaQuery, useWindowSize } from 'usehooks-ts';
import styles from './App.module.scss'
import { images } from './data';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import {
  DndContext,
  DragOverlay,
  DropAnimation,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCenter,
  defaultDropAnimation,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  rectSwappingStrategy,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GalleryImage } from './GalleryImage';
import { SortableItem } from './SortableItem';
import './style.css';
import { createPortal } from 'react-dom';
import { CSS } from '@dnd-kit/utilities';
import { Overlay } from './Overlay';

function SortablePhotos<T extends { id: UniqueIdentifier }>({
  initialItems,
}: {
  initialItems: T[];
}) {
  const edge = 100;
  const scrollDelay = 500;
  const [items, setItems] = useState<T[]>(initialItems);
  const isDragging = useRef(false);
  const [activeItem, setActiveItem] = useState(null);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const scrollArea = useRef({ top: 0, bottom: 1 })
  const scrollY = useRef(0)
  const scrollDown = () => {
    // console.log('scrollDown', cursorY.current, scrollArea.current.bottom)
    scrollDownThrottle.cancel()

    if (isDragging.current && cursorY.current > scrollArea.current.bottom - edge && scrollArea.current.bottom > 100) {
      window.scroll({ top: window.scrollY + 280, behavior: 'smooth' })
      console.log('scroll down')
      scrollDownThrottle()
    }
  }
  const scrollUp = () => {
    console.log('scrollUp')
    window.scroll({ top: window.scrollY - 280, behavior: 'smooth' })
  }

  const scrollUpThrottle = useMemo(() => throttle(scrollUp, scrollDelay), []);
  const scrollDownThrottle = useMemo(() => debounce(scrollDown, scrollDelay), []);
  const cursorY = useRef(0)
  const animationFrameId = useRef()
  const el = useRef()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {
      activationConstraint: {
        tolerance: 8,
        delay: 0,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const isLarge = useMediaQuery('(min-width: 700px)');

  const onDragEnd = (event) => {
    scrollDownThrottle.cancel()
    isDragging.current = false
    setActiveItem(null)
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const onDragStart = ({ active: { id } }) => {
    setActiveItem(items.find((item) => item.id === id));
    isDragging.current = true
  }
  // const draggingCb = useCallback(() => {
  //
  //   const y = cursorY.current;
  //
  //   if (y > screen.height - 100) {
  //     scrollDownThrottle();
  //   }
  //
  //   else if (y < 100) {
  //     scrollUpThrottle();
  //   }
  //   animationFrameId.current = requestAnimationFrame(draggingCb)
  //
  // }, [])
  //
  // useEffect(() => {
  //   if (!isDragging) {
  //     scrollUpThrottle.cancel();
  //     scrollDownThrottle.cancel();
  //     cancelAnimationFrame(animationFrameId.current)
  //     return;
  //   }
  //
  //   animationFrameId.current = requestAnimationFrame(draggingCb);
  //   () => {
  //     cancelAnimationFrame(animationFrameId.current)
  //   }
  // }, [isDragging])
  const setupScrollArea = () => {
    const top = Math.max(0, el.current.offsetTop - window.scrollY)
    const bottom = Math.min(window.innerHeight, el.current.offsetHeight + el.current.offsetTop - window.scrollY)
    // console.log(top, bottom, el.current.offsetHeight + el.current.offsetTop - window.scrollY)
    scrollArea.current = { top, bottom }
  }
  // const updateCursor = useCallback((e) => {
  //   // cursorY.current = e.delta.y
  //   // const scrollOffset = Math.max(0, 80 - window.scrollY)
  //   const position = e.delta.y + e.activatorEvent.touches[0].clientY
  //   // console.log(`touch ${position} window ${window.scrollY} bottom ${bottom} top ${top}`)
  //   cursorY.current = position;
  //   // console.log(position, scrollArea.current.bottom)
  //   console.log('cursor', e.delta.y)
  //   if (cursorY.current > scrollArea.current.bottom - edge) {
  //     scrollDownThrottle()
  //   }
  // }, [el, scrollArea])

  useEffect(() => {
    const onScroll = () => {
      scrollY.current = window.scrollY
      setupScrollArea()
    }
    const onMoveCursor = (e) => {
      cursorY.current = e.pageY
      if (cursorY.current > scrollArea.current.bottom - edge) {
        scrollDownThrottle()
      }

    }
    window.addEventListener('scroll', onScroll)
    window.addEventListener('pointermove', onMoveCursor)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onMoveCursor)
    }
  }, [])
  useEffect(() => {
    setupScrollArea()
  }, [windowWidth, windowHeight])
  useEffect(() => setupScrollArea(), [])


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      autoScroll={false}
      // onDragMove={updateCursor}
      onDragEnd={onDragEnd}
      modifiers={isLarge ? [] : [restrictToVerticalAxis]}
    >
      <div className="image-grid" onContextMenu={() => { }} ref={el}>
        <SortableContext
          items={items}
          strategy={
            isLarge ? rectSwappingStrategy : verticalListSortingStrategy
          }
        >
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              <GalleryImage item={item} ghost={item.id === activeItem?.id} />
            </SortableItem>
          ))}

          <Overlay item={activeItem} />
        </SortableContext>
      </div>
    </DndContext>
  );
}


export default function App() {
  return (
    <div onContextMenu={() => { }}>
      <div className={styles.placeholder} />
      <SortablePhotos initialItems={images} />
      <div className={styles.placeholder2} />
    </div>
  );
}
