import { MyImage } from './types';

export const images: MyImage[] = [
  'https://getmyboat-user-images1.imgix.net/images/001-non-production/localhost/63e6695d475c0/-processed.jpg?ixlib=js-3.6.1&auto=compress%2Cenhance%2Cformat&w=900&q=50&dpr=1',
  'https://getmyboat-user-images1.imgix.net/images/001-non-production/localhost/63e66a0359ce6/-processed.jpg?ixlib=js-3.6.1&auto=compress%2Cenhance%2Cformat&w=900&q=50&dpr=1',
  'https://getmyboat-user-images1.imgix.net/images/001-non-production/localhost/63e66a8d133d0/-processed.jpg?ixlib=js-3.6.1&auto=compress%2Cenhance%2Cformat&w=900&q=50&dpr=1',
  'https://getmyboat-user-images1.imgix.net/images/001-non-production/localhost/63e66b165c9e1/-processed.jpg?ixlib=js-3.6.1&auto=compress%2Cenhance%2Cformat&w=900&q=50&dpr=1',
  'https://getmyboat-user-images1.imgix.net/images/001-non-production/localhost/63e66bec53560/-processed.jpg?ixlib=js-3.6.1&auto=compress%2Cenhance%2Cformat&w=900&q=50&dpr=1',
  'https://getmyboat-user-images1.imgix.net/images/001-non-production/localhost/63e66cddb3e0c/-processed.jpg?ixlib=js-3.6.1&auto=compress%2Cenhance%2Cformat&w=900&q=50&dpr=1',
  'https://getmyboat-user-images1.imgix.net/images/001-non-production/localhost/63e66fcb2e277/-processed.jpg?ixlib=js-3.6.1&auto=compress%2Cenhance%2Cformat&w=900&q=50&dpr=1',
  'https://getmyboat-user-images1.imgix.net/images/001-non-production/localhost/6376176628733/-processed.jpg?ixlib=js-3.6.1&auto=compress%2Cenhance%2Cformat&w=900&q=50&dpr=1',
].map((src, i) => ({
  id: i + 1,
  src,
}));
