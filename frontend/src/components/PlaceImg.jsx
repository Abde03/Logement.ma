import React from 'react'
import Image from '../components/image'

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
