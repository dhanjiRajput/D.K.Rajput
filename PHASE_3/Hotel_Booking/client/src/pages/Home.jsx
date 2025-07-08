import ExclusiveOffers from '../components/ExclusiveOffers'
import FeaturedDestination from '../components/FeaturedDestination'
import Hero from '../components/Hero'
import NewsLetter from '../components/NewsLetter'
import RecommendedHotel from '../components/RecommendedHotel'
import Testimonial from '../components/Testimonial'

const Home = () => {
  return (
    <>
        <Hero/>
        <RecommendedHotel/>
        <FeaturedDestination/>
        <ExclusiveOffers/>
        <Testimonial/>
        <NewsLetter/>
    </>
  )
}

export default Home