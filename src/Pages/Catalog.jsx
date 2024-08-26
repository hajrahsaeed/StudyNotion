import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentsData';
import CourseCard from '../components/core/Catalog/CourseCard';
import CourseSlider from '../components/core/Catalog/CourseSlider';


const Catalog = () => {

    const [active, setActive] = useState(1)
    const {catalogName} = useParams();
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState(""); 

    //fetch all categories
    useEffect(()=>{
        const getCategories = async() => {
            const response = await apiConnector("GET", categories.CATEGORIES_API);
            console.log("RESPONSE-> ", response);
            const category_id = response?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            console.log("Response Printing->",category_id);
            setCategoryId(category_id);
        }

        getCategories();
    },[catalogName])

    useEffect(()=>{
        const getCategoryDetails = async() => {
            try{
                const res = await getCatalogPageData(categoryId)
                console.log("Printing->",res);
                setCatalogPageData(res);
            }catch(error){
                console.log(error);
            }
        }
        if(categoryId) {
            getCategoryDetails();
        }
    },[categoryId]);

    console.log("Catalog Page Data:", catalogPageData); // Check the structure of the fetched data


    return(
        <div className=" box-content bg-richblack-800 px-4">

            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                <p className="text-sm text-richblack-300">
                    {`Home / Catalog`}
                    <span className="text-yellow-25">
                        {catalogPageData?.selectedCategory?.name}
                    </span>
                </p>
                <p className="text-3xl text-richblack-5">
                    {catalogPageData?.selectedCategory?.name}
                </p>
                <p className="max-w-[870px] text-richblack-200">
                    {catalogPageData?.selectedCategory?.description}
                </p>
            </div>

            <div>
                {/* Section 1 */}
                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">Course to get you started</div>
                    <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                        <p
                            className={`px-4 py-2 ${
                                active === 1
                                  ? "border-b border-b-yellow-25 text-yellow-25"
                                  : "text-richblack-50"
                            } cursor-pointer`}
                            onClick={() => setActive(1)}                    
                        >
                            Most Popular
                        </p>
                        <p
                            className={`px-4 py-2 ${
                                active === 2
                                  ? "border-b border-b-yellow-25 text-yellow-25"
                                  : "text-richblack-50"
                            } cursor-pointer`}
                            onClick={() => setActive(2)}
                        >
                            New
                        </p>
                    </div>
                    <CourseSlider Courses = {catalogPageData?.selectedCategory?.courses}/>
                </div>
                {/* Section 2 */}
                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <p className="section_heading">
                        Top Courses in {catalogPageData?.differentCategory?.name}
                    </p>
                    <div>
                        <CourseSlider Courses ={catalogPageData?.differentCategory?.courses}/>
                    </div>
                </div>
                {/* Section 3 */}
                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className="section_heading">
                        Frequently Bought Together
                    </div>
                    <div className='py-8'>
                        <div className='grid grid-cols-1  gap-6 lg:grid-cols-2'>
                            {
                                catalogPageData?.mostSellingCourses?.slice(0,4)
                                .map((course, index)=>(
                                    <CourseCard course={course} key={index} height={"h-[400px]"}/>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>

        <Footer/>

        </div>
    )
}

export default Catalog;