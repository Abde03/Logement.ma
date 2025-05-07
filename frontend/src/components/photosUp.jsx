import { useState } from 'react'
import { GoUpload , GoStarFill } from "react-icons/go";
import axios from 'axios';
import Image from './image';
import { CiTrash, CiStar  } from "react-icons/ci";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

PhotosUp.propTypes = {
  addedPhotos: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};
  
PhotosUp.defaultProps = {
  addedPhotos: [],
};



export default function PhotosUp ({addedPhotos,onChange}) {
  const [photoLink , setPhotoLink] = useState('');

  const imageLink = async(ev) => {
    ev.preventDefault();
    try {
      const {data} = await axios.post('/imageUploader', {link: photoLink,})
      if(data.success) {
      onChange(prev => {
        return [...prev, data.filename];
      });
      setPhotoLink('');
      toast.success(data.message);
      }
      else {
        toast.error(data.message);
      }
    }
    catch (error) {
      toast.error(error.message);
    }    
  }
    
  const  download = async(ev) => {
    const files = ev.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }
    try{
      const {data} = await axios.post('/download', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const {success, message, uploadedFiles} = data;
      if(success) {
        onChange(prev => {
          return [...prev, ...uploadedFiles];
        });
        toast.success(message);
      }
      else {
        toast.error(message);
      }
    }catch (error) {
      toast.error(error.message);
    }
  }
      

      function removePhoto (ev ,link) {
        ev.preventDefault();
        onChange([...addedPhotos.filter(photo => photo !== link)]);
      }

      function mainPhoto (ev, link) {
        ev.preventDefault();
        const noSelected = addedPhotos.filter(photo => photo !== link);
        const newPhotos = [link, ...noSelected];
        onChange(newPhotos);
      }

  return (
    <>
        <div className="flex gap-2">
            <input type="text" 
              value={photoLink} 
              onChange={(e) => setPhotoLink(e.target.value)}
              placeholder='Add photos from the link' 
            />
            <button onClick={imageLink} className='border bg-transparent rounded-2xl px-4 hover:bg-primary hover:text-white'>
              Add
            </button>
            </div>
            <div className='mt-2 grid gap-1 grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
            {addedPhotos.length>0 ?(
              addedPhotos.map((link,key) => (
                  <div key={key} className='h-32 flex relative'>
                    <Image src={link} className='w-full h-32 object-cover rounded-2xl' />
                    <button onClick={(ev) => removePhoto(ev ,link)} className='cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-40 rounded-2xl py-2 px-3'>
                      <CiTrash />
                    </button>
                    <button onClick={(ev) => mainPhoto(ev ,link)} className='cursor-pointer absolute bottom-1 left-1 text-white bg-black bg-opacity-40 rounded-2xl py-2 px-3'>
                      {
                        link === addedPhotos[0] ? <GoStarFill /> : <CiStar />
                      }
                      
                    </button>
                  </div>
                ))) :(
                  ''
                )
                }
              <label className='cursor-pointer flex justify-center items-center border bg-transparent rounded-2xl p-8 gap-1 text-xl'>
                <input type="file" className='hidden' onChange={download} />
                <GoUpload />
                Download
              </label>
            </div>
    </>
  )
}
