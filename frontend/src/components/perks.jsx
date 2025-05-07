import PropTypes from 'prop-types';
import { PiFanLight , PiPersonSimpleSwimLight , PiTelevision , PiWifiHigh  } from "react-icons/pi";
import { CiParking1 } from "react-icons/ci";
import { TbFridge } from "react-icons/tb";

Perks.propTypes = {
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
};
  
Perks.defaultProps = {
    selected: [],
};



export default function Perks({selected , onChange}) {
    function handleChange(e){
        const {checked,name} = e.target;
        if(checked) {
            onChange([...selected, name]);
        }else{
            onChange(selected.filter(item => item !== name));
        }
    }
  return (
    <>
        <label className='border p-4 flex rounded-2xl gap-2 items-center' >
            <input type='checkbox' checked = {selected.includes('wifi')} name='wifi' onChange={handleChange} />
            <PiWifiHigh />
            <span>Wifi</span>
        </label>
        <label className='border p-4 flex rounded-2xl gap-2 items-center'>
            <input type='checkbox' checked = {selected.includes('parking')} name='parking' onChange={handleChange} />
            <CiParking1 />
            <span>Park</span>
        </label>
        <label className='border p-4 flex rounded-2xl gap-2 items-center'>
            <input type='checkbox' checked = {selected.includes('piscine')} name='piscine' onChange={handleChange} />
            <PiPersonSimpleSwimLight  />
            <span>Pool</span>
        </label>
        <label className='border p-4 flex rounded-2xl gap-2 items-center'>
            <input type='checkbox' checked = {selected.includes('climat')} name='climat' onChange={handleChange} />
            <PiFanLight />
            <span>Climat</span>
        </label>
        <label className='border p-4 flex rounded-2xl gap-2 items-center'>
            <input type='checkbox' checked = {selected.includes('tv')} name='tv' onChange={handleChange} />
            <PiTelevision />
            <span>TV</span>
        </label>
        <label className='border p-4 flex rounded-2xl gap-2 items-center'>
            <input type='checkbox' checked = {selected.includes('fridge')} name='fridge' onChange={handleChange} />
            <TbFridge />
            <span>Fridge</span>
        </label>
    </>
  )
}
