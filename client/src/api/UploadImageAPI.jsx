import axios from "axios";

export const uploadImageAPI = async (image) => {
  return await axios.post(`${import.meta.env.VITE_API}/upload-main-image`,
    image
  );
};

export const uploadGalleryAPI = async (image) => {
  return await axios.post(`${import.meta.env.VITE_API}/upload-gallery`,
    image
  );
};

export const deleteImageAPI = async (public_id,secure_url,id) =>{
  return await axios.delete(`${import.meta.env.VITE_API}/delete-main-image`,{
    data:{
      public_id,
      secure_url,
      id  
    },
    
  }
    )
}
export const deleteGalleryImageAPI = async (public_id,secure_url,placeId) =>{
  return await axios.delete(`${import.meta.env.VITE_API}/delete-gallery-image`,{
    data:{
      public_id,
      secure_url,
      placeId
    },
    
  }
    )
}

export const deleteTempMainImage = async (public_id) =>{
  return await axios.delete(`${import.meta.env.VITE_API}/delete-temp-main-image`,{
    data:{public_id}
  })
}
export const deleteTempGallery = async (public_id) =>{
  return await axios.delete(`${import.meta.env.VITE_API}/delete-temp-gallery`,{
    data:{public_id}
  })
}