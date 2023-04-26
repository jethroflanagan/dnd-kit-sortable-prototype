
import classNames from 'classnames/bind';

const getClassNames = (
  styles: Readonly<Record<string, string>>,
  base: string,
  modifier: string = '',
): string => {
  const cx = classNames.bind(styles);
  return cx(
    base,
    modifier?.split(' ').map((m) => m && `${base}_${m}`),
  );
};

export default getClassNames;
