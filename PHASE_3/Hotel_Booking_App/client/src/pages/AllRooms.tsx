import { useNavigate } from "react-router-dom"
import { roomsDummyData } from "../assets/assets"

const AllRooms = () => {
    const navigate=useNavigate()
    return (
        <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">

            {/* Rooms/Hotels Listing */}
            <div>
                <div className="flex flex-col items-start text-left">
                    <h1 className="font-palyfair text-4xl md:text-[40px]">Hotel Rooms</h1>
                    <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
                        Take Advantage of our limitted time offers and Special Packages to enhance your stay and create unforgetable memories.
                    </p>
                </div>
                {
                    roomsDummyData.map((room)=>(
                        <div>
                            <img onClick={()=>navigate(`/rooms/${room._id}`)} src={room.images[0]} alt="Hotel Image" title="View Room Details" className="max-h-56 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"/>
                        </div>
                    ))
                }
            </div>
            {/* Filter the content */}
            <div>

            </div>
        </div>
    )
}

export default AllRooms