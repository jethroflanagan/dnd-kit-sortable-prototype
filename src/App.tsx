import * as React from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { images } from './data';

import './style.css';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
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

const disableContextMenu = (e) => e.preventDefault();

function SortablePhotos<T extends { id: UniqueIdentifier }>({
  initialItems,
}: {
  initialItems: T[];
}) {
  const [items, setItems] = React.useState<T[]>(initialItems);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const isLarge = useMediaQuery('(min-width: 700px)');

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
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
              <div
                className="img"
                key={item.src}
                onContextMenu={disableContextMenu}
              >
                <img src={item.src} onContextMenu={disableContextMenu} />
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

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
  children: React.ReactNode;
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
