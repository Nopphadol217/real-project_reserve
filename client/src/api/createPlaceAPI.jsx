import axios from "axios";

// สร้างข้อมูลที่พักและอัพโหลดรูปภาพในคราวเดียว
export const createPlace = async (placeData) => {
  return await axios.post(`${import.meta.env.VITE_API}/place`, placeData);
    
};

// ดึงข้อมูลที่พักตาม ID
export const readPlace = async (id) => {
  return await axios.get(`${import.meta.env.VITE_API}/place/${id}`)
};

export const listPlaces = async()=>{
  return await axios.get(`${import.meta.env.VITE_API}/places`)
}
  

// แก้ไขข้อมูลที่พัก
export const updatePlace = async (id, placeData) => {
  return await axios.put(`${import.meta.env.VITE_API}/place/${id}`,placeData)
};


//ลบข้อมูล
export const deletePlace = async (id,item) => {
 return await axios.delete(`${import.meta.env.VITE_API}/place/${id}`,{item:item})
}
