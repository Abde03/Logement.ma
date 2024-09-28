export default function Image({src,...rest}) {
    src = src && src.includes('https://' , '')
      ? src
      : src.includes('/uploads/') ? 'https://logement-ma.onrender.com/uploads/'+src : 'https://logement-ma.onrender.com/'+src ;
    
    return (
      <img {...rest} src={src} alt={''} />
    );
  }