import './Store.scss';
import { dishes } from '../../../data';
import PopularStoreItem from './PopularStoreItem';
import Flyer from '../../components/Flyer/Flyer';
import Dishes from '../../components/Dishes/Dishes';
export default function Store() {
  return (
    <section className='shop'>

        <Flyer />
        {
          dishes.length > 0 && <Dishes data={dishes}/>
        }

        <h1 className="heading">Explore Brands</h1>
        <div className="container">
          {
            dishes && dishes.map(item => {
              return <PopularStoreItem data={{...item}} key={item.id} />
            })
          }
        </div>
        <h3 className="sub-heading">Discover Variety</h3>
        <h1 className="heading">Popular Drinks</h1>
        <div className="container">
          {
            dishes && dishes.map(item => {
              return <PopularStoreItem data={{...item}} key={item.id} />
            })
          }
        </div>
    </section>
  )
}
