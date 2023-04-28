import { useMediaQuery, useWindowSize } from 'usehooks-ts';
import styles from './App.module.scss'
import { images } from './data';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCenter,
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
import { useCallback, useEffect, useRef, useState } from 'react';
import { GalleryImage } from './GalleryImage';
import { SortableItem } from './SortableItem';
import './style.css';
import { Overlay } from './Overlay';
import getClassNames from './getClassNames';
import classNames from 'classnames';

function SortablePhotos<T extends { id: UniqueIdentifier }>({
  initialItems,
}: {
  initialItems: T[];
}) {
  const EDGE = 100
  const [items, setItems] = useState<T[]>(initialItems);
  const [activeItem, setActiveItem] = useState(null);
  const scrollDirection = useRef(0)
  const el = useRef()
  const scrollAmount = useRef(0)

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
    setActiveItem(null)

    scrollDirection.current = 0;
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
  }
  const debounceScroll = useCallback(debounce(() => {
    debounceScroll.cancel();
    if (scrollDirection.current) {
      const speed = scrollAmount.current;

      window.scrollTo({
        top: window.scrollY + scrollDirection.current * speed,
        behavior: 'smooth'
      })
    }
    scroll()
  }, 700));

  const scroll = useCallback(debounceScroll)

  useEffect(() => {
    const preventScroll = (e) => {
      e.preventDefault()

      const cursorY = e.touches[0].clientY;

      if (cursorY < EDGE) {
        scrollDirection.current = -1;
      } else if (cursorY > window.innerHeight - EDGE) {
        scrollDirection.current = 1;
      }
      else {
        scrollDirection.current = 0;
      }
    }

    if (activeItem != null) {
      document.addEventListener('touchmove', preventScroll, { passive: false })
      setupSize()
    }
    else {
      document.removeEventListener('touchmove', preventScroll)
    }

    return () => document.removeEventListener('touchmove', preventScroll)
  }, [activeItem])

  const setupSize = () => {
    const child = el.current?.querySelector('div:first-child')
    scrollAmount.current = child.offsetHeight + 30; // gap, hardcorded while testing
  }

  useEffect(() => {
    scroll()
  }, [])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      autoScroll={false}
      onDragEnd={onDragEnd}
      modifiers={isLarge ? [] : [restrictToVerticalAxis]}
    >
      <div className={styles.imageGrid} onContextMenu={() => { }} ref={el}>
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
    <div onContextMenu={() => { }} className={styles.scroll}>
      <div className={styles.placeholder} />
      <SortablePhotos initialItems={images} />
      <div className={styles.placeholder2} />
    </div>
  );
}
