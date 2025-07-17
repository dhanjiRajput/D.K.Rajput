
import { useContext, useEffect, useState } from 'react';
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainDetails = () => {

  const {captain}=useContext(CaptainDataContext);
  const [data,setData]=useState({});
  
  useEffect(()=>{
    setData(captain);
  },[])

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex justify-start gap-3 items-center">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://png.pngtree.com/png-clipart/20250501/original/pngtree-a-confident-male-model-with-subtle-charming-png-image_20921424.png"
            alt=""
          />
          <h4 className="text-lg font-medium capitalize">
            {data.fullname?.firstname ?? 'Captain'} {data.fullname?.lastname ?? ''}
          </h4>
        </div>
        <div>
          <h4 className="text-xl font-semibold">₹ 295.20</h4>
          <p className="text-sm text-gray-600">Earned</p>
        </div>
      </div>

      <div className="flex p-6 bg-gray-100 rounded-xl justify-center items-start mt-6 gap-5">
        <div className="text-center">
          <i className="text-2xl mb-2 font-thin ri-timer-fill"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="text-2xl mb-2 font-thin ri-pin-distance-fill"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">KM Online</p>
        </div>
        <div className="text-center">
          <i className="text-2xl mb-2 font-thin ri-booklet-fill"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Notes Online</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
