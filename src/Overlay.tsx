import { DragOverlay, DropAnimation, UniqueIdentifier, defaultDropAnimation } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities';
import { createPortal } from 'react-dom'
import { SortableItem } from './SortableItem';
import { GalleryImage } from './GalleryImage';
import { FC, useEffect } from 'react';

export type OverlayProps = {
  item: {
    id: string;
  };
};
export const Overlay: FC<OverlayProps> = ({ item }) => {

  const dropAnimationConfig: DropAnimation = {
    keyframes({ transform }) {
      return [
        { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
        {
          opacity: 0,
          transform: CSS.Transform.toString({
            ...transform.final,
            x: transform.final.x + 5,
            y: transform.final.y + 5,
          }),
        },
      ];
    },
    easing: 'ease-out',
    sideEffects({ active }) {
      active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: defaultDropAnimation.duration,
        easing: defaultDropAnimation.easing,
      });
    },
  };
  useEffect(() => {
    console.log('item', item?.id)
  }, [item])
  return <>{createPortal(
    <DragOverlay
      // dropAnimation={dropAnimationConfig}
      modifiers={[]}
    >
      {item?.id != null && (
        <SortableItem key={item.id} id={item.id}>
          <GalleryImage item={item} active={true} />
        </SortableItem>
      )}
    </DragOverlay>,
    document.body
  )}</>
}
