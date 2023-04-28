import classNames from 'classnames';
import styles from './GalleryImage.module.scss'
import getClassNames from './getClassNames';
import { useSortable } from '@dnd-kit/sortable';
export const GalleryImage = ({ item, active, ghost }) => {

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  return (
    <div
      className={getClassNames(styles, 'wrapper', classNames({ active, ghost }))}
      key={item.src}
      onContextMenu={() => { }}
    >
      <img src={item.src} onContextMenu={() => { }} className={styles.image} />
      <div className={styles.overlay} />
      <div className={styles.handle} {...listeners} />
      <div className={styles.fill} />
    </div >
  )
}
