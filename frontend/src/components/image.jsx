export default function Image({src,...rest}) {
    src = src && src.includes('https://' , '')
      ? src
      : src.includes('/uploads/') ? 'http://localhost:4000/uploads/'+src : 'http://localhost:4000/'+src ;
    
    return (
      <img {...rest} src={src} alt={''} />
    );
  }