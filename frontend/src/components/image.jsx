import PropTypes from 'prop-types';

export default function Image({src,...rest}) {
  if (typeof src !== 'string') {
    console.warn('Invalid src passed to <Image>:', src);
    return null;
  }
    src = src && src.includes('https://')
      ? src
      : src.includes('uploads') ? import.meta.env.VITE_BACKEND_URL + src : import.meta.env.VITE_BACKEND_URL + 'uploads/' + src;
    
    return (
      <img {...rest} src={src} alt={''} />
    );
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  rest: PropTypes.object,
};