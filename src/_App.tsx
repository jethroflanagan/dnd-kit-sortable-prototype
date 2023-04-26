import { useMediaQuery } from 'usehooks-ts';

import { images } from './data';

import './style.css';
import throttle from 'lodash.throttle';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import {
  rectSwappingStrategy,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GalleryImage } from './GalleryImage';

const disableContextMenu = (e) => e.preventDefault();
function SortablePhotos<T extends { id: UniqueIdentifier }>({
  initialItems,
}: {
  initialItems: T[];
}) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [isDragging, setDragging] = useState(false);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        // distance: 7,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        // delay: 300,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const scrollDown = () => {
    console.log('scrollDown')
    window.scroll({ top: window.scrollY + 280, behavior: 'smooth' })
  }
  const scrollUp = () => {
    console.log('scrollUp')
    window.scroll({ top: window.scrollY - 280, behavior: 'smooth' })
  }
  const scrollUpThrottle = useMemo(() => throttle(scrollUp, 500), []);
  const scrollDownThrottle = useMemo(() => throttle(scrollDown, 500), []);
  const cursorY = useRef(0)
  const animationFrameId = useRef('');

  const isLarge = useMediaQuery('(min-width: 700px)');
  // useEffect(() => {
  //   document.on('touchmove', function(e) {
  //     e.preventDefault();
  //   });
  // })


  const draggingCb = useCallback(() => {

    const y = cursorY.current;

    if (y > screen.height - 100) {
      scrollDownThrottle();
    }

    else if (y < 100) {
      scrollUpThrottle();
    }
    animationFrameId.current = requestAnimationFrame(draggingCb)

  }, [])

  useEffect(() => {
    if (!isDragging) {
      scrollUpThrottle.cancel();
      scrollDownThrottle.cancel();
      cancelAnimationFrame(animationFrameId.current)
      return;
    }

    animationFrameId.current = requestAnimationFrame(draggingCb);
    () => {
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [isDragging])

  const updateCursor = (e) => {
    cursorY.current = e.activatorEvent.touches?.[0]?.clientY + e.delta.y

  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={() => setDragging(true)}
      onDragMove={updateCursor}
      autoScroll={false}
      onDragEnd={handleDragEnd}
      modifiers={isLarge ? [] : [restrictToVerticalAxis]}
    >
      <div className="image-grid" onContextMenu={disableContextMenu}>
        <SortableContext
          items={items}
          strategy={
            isLarge ? rectSwappingStrategy : verticalListSortingStrategy
          }
        >
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              <GalleryImage item={item} />
            </SortableItem>
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );

  function handleDragEnd(event) {

    cancelAnimationFrame(animationFrameId.current)
    const { active, over } = event;
    setDragging(false)
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

}

type SortableItemProps = {
  id: UniqueIdentifier;
  children: ReactNode;
};

export function SortableItem(props: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onContextMenu={disableContextMenu}
    >
      {props.children}
    </div>
  );
}

export default function App() {
  return (
    <div onContextMenu={disableContextMenu}>
      <SortablePhotos initialItems={images} />
    </div>
  );
}
