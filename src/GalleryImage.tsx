import classNames from 'classnames';
import styles from './GalleryImage.module.scss'
import getClassNames from './getClassNames';
const disableContextMenu = (e) => e.preventDefault();
export const GalleryImage = ({ item, active, ghost }) => {

  return (
    <div
      className={getClassNames(styles, 'wrapper', classNames({ active, ghost }))}
      key={item.src}
      onContextMenu={disableContextMenu}
    >
      <img src={item.src} onContextMenu={disableContextMenu} className={styles.image} />
      <div className={styles.handle} />
    </div >
  )
}
