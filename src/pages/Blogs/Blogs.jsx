import './Blogs.scss';
import BlogItem from './BlogItem'
import Newsletter from '../../components/Newsletter/Newsletter'

export default function Blogs() {
  return (
    <section className='blogs'>
        <h1 className="heading">Read Our Blogs</h1>
        <div className="container">
            <BlogItem />
            <BlogItem />
            <BlogItem />
            <BlogItem />
            <BlogItem />
            <BlogItem />
        </div>
        <Newsletter />
    </section>
  )
}
