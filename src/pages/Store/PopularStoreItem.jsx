import React, { useState } from 'react'
import {FaCheck, FaEye, FaPlus, FaShareAlt, FaStar } from "react-icons/fa";
import ShareModal from '../../components/ShareModal/ShareModal';
import { NavLink } from 'react-router-dom';

export default function PopularStoreItem({data}) {
    const [inStore, setInStore] = useState(false);
    const [visible, setVisible] = useState(false);

    return(
        <div className="card">
            {
                visible && <ShareModal visible={visible} setVisible={setVisible}/>
            }
             
            <div className="image">
                <img src={data.image} alt="" />
                <a className='icon share'  onClick={() => setVisible(true)}><FaShareAlt /></a>
            </div>
            <div className="content">
                <div className="meta">
                    <span className='trailing'><FaStar className='star'/> 5.2K</span>
                    <div className="duration">KSH {data.price}</div>
                </div> 
                
                <NavLink to={`shop/${data.id}`}><h3>{data.title}</h3></NavLink>
                
                <p>{data.description}</p>
                {
                    inStore ? <a className="add green" onClick={() => setInStore(!inStore)}> <FaCheck /></a> : <a className="add" onClick={() => setInStore(!inStore)}><FaPlus /></a>
                }
            </div>
        </div>
    )
}
