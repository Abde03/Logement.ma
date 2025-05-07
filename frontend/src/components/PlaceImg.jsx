import PropTypes from 'prop-types';
import Image from '../components/image'

PlaceImg.propTypes = {
    place: PropTypes.shape({
        images: PropTypes.arrayOf(PropTypes.string).isRequired,
        title: PropTypes.string.isRequired,
    }).isRequired,
    index: PropTypes.number,
    className: PropTypes.string,
};

export default function PlaceImg({place,index=0,className=null}) {
    if (!place.images.length > 0) {
        return '';
    }
    if (!className) {
        className = 'object-cover';
    }
    return (
        <Image className={className} src={place.images[index]} alt=""/>
    );
}
