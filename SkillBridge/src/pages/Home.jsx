import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { TypeAnimation } from 'react-type-animation'
import { Link } from 'react-router-dom'
import Highlight  from '../components/HomePage/Highlight'
import CTAButton from '../components/HomePage/CTAButton'
import Banner from '../assets/images/v7.mp4'
import CodeBlocks from '../components/HomePage/CodeBlocks'
import bgImage from '../assets/images/bgImage.avif'
import LearningLanguageSection from '../components/HomePage/LearningLanguageSection'
import TimeLineSection from '../components/HomePage/TimeLineSection'
import InstructorSection from '../components/HomePage/InstructorSection'
import Footer from '../components/common/Footer'
import ExporeMore from '../components/HomePage/ExporeMore'

        const htmlCode = `<!DOCTYPE html>
        <html>
        <head>
            <title>Example</title>
            <link rel="stylesheet" href="styles.css" />
        </head>
        <body>
            <h1>
            <a href="/">Header</a>
            </h1>

            <nav>
            <a href="one">One</a>
            <a href="two">Two</a>
            <a href="three">Three</a>
            </nav>
        </body>
        </html>`;


const Home = () => {
  return (
    <div>
{/* section 1 */}
                <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-center text-white">

                {/* Instructor CTA */}
   <Link to="/signup" className="group mt-16">
  <div
    className="
      relative flex items-center gap-2 rounded-full
      px-7 py-3 font-semibold text-sm
      bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500
      shadow-lg shadow-purple-500/30
      transition-all duration-300
      hover:scale-95 hover:shadow-pink-500/50
    "
  >
    <span className="relative z-10">Become an Instructor</span>
    <FaArrowRight className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />

    {/* Glow effect */}
    <div
      className="
        absolute inset-0 rounded-full
        blur-lg opacity-40
        bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500
        group-hover:opacity-70
        transition-opacity duration-300
      "
    />
  </div>
</Link>


                {/* Heading */}
                <div
                    className="
                    mt-6 text-center text-4xl font-semibold
                    transition-all duration-500 ease-out
                    hover:scale-[1.02]
                    "
                >
                    Empower Your Future With
                    <Highlight text={" Coding Skills"} />
                </div>

                {/* Description */}
                <div
                    className="
                    mt-5 w-[90%] text-center text-lg font-medium text-gray-400
                    transition-all duration-300
                    hover:text-gray-300
                    "
                >
                    With our online coding courses, you can learn at your own pace, from
                    anywhere in the world, and get access to a wealth of resources, including
                    hands-on projects, quizzes, and personalized feedback from instructors.
                </div>

                {/* CTA Buttons */}
                <div className="mt-8 flex flex-row gap-7">
                    <CTAButton active={true} linkto={"/signup"}>
                    Learn More
                    </CTAButton>

                    <CTAButton active={false} linkto={"/login"}>
                    Book a Demo
                    </CTAButton>
                </div>

     {/* Video Banner */}
                    <div className="relative mt-14 group">
                    
                    {/* Glow layer */}
                    <div
                        className="
                        absolute -inset-2 rounded-xl
                        bg-gray-50/30
                        blur-2xl
                        opacity-0
                        transition-opacity duration-500
                        group-hover:opacity-100
                        "
                    />

                    {/* Video container */}
                    <div
                        className="
                        relative overflow-hidden rounded-xl
                        transition-transform duration-500
                        group-hover:scale-[1.02]
                        "
                    >
                        <video
                        muted
                        loop
                        autoPlay
                        className="
                            w-full rounded-xl
                            transition-transform duration-500
                            group-hover:scale-105
                        "
                        >
                        <source src={Banner} type="video/mp4" />
                        </video>
                    </div>
                    </div>

                    {/*code sction 1  */}
<div className="mx-auto w-11/12 max-w-maxContent ">
        <CodeBlocks
          position="flex-row-reverse"
          heading={
            <h2 className="text-4xl font-semibold">
              Unlock Your  with our online courses. <Highlight text="Coding potential" />
            </h2>
          }
          subheading="Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson. A modern platform designed to help you learn, practice, and master coding faster."
          ctabtn1={{
            btnText: "Try Yourself",
            link: "/signup",
            active: true,
          }}
          ctabtn2={{
            btnText: "Learn More",
            link: "/login",
            active: false,
          }}
          codeblock={htmlCode}
          codeColor="text-yellow-200"
        />
      </div>
       {/* code section 2 */}
                 <div className="mx-auto w-11/12 max-w-maxContent ">
        <CodeBlocks
          position="flex-row"
          heading={
            <h2 className="text-4xl font-semibold">
              Start <Highlight text="coding in seconds" />
            </h2>
          }
          subheading=" Write real code, solve real problems, and build skills that matter in the real world.Master in-demand coding skills through interactive lessons, real-world projects, and guided practice."
          ctabtn1={{
            btnText: "Continue Lesson",
            link: "/signup",
            active: true,
          }}
          ctabtn2={{
            btnText: "Learn More",
            link: "/login",
            active: false,
          }}
          codeblock={htmlCode}
          codeColor="text-yellow-200"
        />
      </div >

          <ExporeMore/>   
         </div>


        {/* section 2 */}

      <div className='bg-gray-50 mt-23 text-gray-700'>
         <div 
       style={{
        backgroundImage: `url(${bgImage})`,

       }}
       className='w-full  rounded-xl' >
        <div className='w-11/12 max-w-maxContent flex  items-center gap-5 mx-auto'>
        <div className='flex flex-row mt-30 items-center justify-center px-90 gap-7 text-white'>
            <CTAButton active={true} linkto={"/signup"}>
              <div className='flex items-center gap-3'>
                 Expore Full Catalog
                 <FaArrowRight/>
              </div>
            </CTAButton>
             <CTAButton active={false} linkto={"/login"}>
              <div className='flex items-center gap-3'>
                 Learn More
                
              </div>
            </CTAButton>

        </div>


        </div>
         <div className='mx-auto w-11/12 max-w-maxContent mt-30 flex flex-row '>
       <div  className='flex flex-row gap-2'>
        <div className='text-4xl text-gray-700 items-center  font-semibold w-[50%]'>
            Get the Skill you need for a
            <Highlight text={"Job that is in demand"} />
        </div>
       </div>

       <div className='flex flex-col gap-10 w-[40%] items-start'>
         <div className='text-[16px] text-gray-700 font-bold'>
            The modern SkillBridge is the dictates its own term .Today, to be a competative specialist requires more than professional skill.
         </div>
         <CTAButton active={true} linkto={"/signup"}>
         <div>
            Learn more 
         </div>
         </CTAButton>

       </div>
       


      </div>


       </div>
      </div>
       
       <TimeLineSection/>
       <LearningLanguageSection/>

     
 
        {/* section 3 */}

        <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-center gap-8 bg-gray-950 text-white'>

            <InstructorSection/>

            <h2 className='text-center text-4xl font-semibold mt-10'>review from other learners</h2>
        </div>

        {/* section */}
        <Footer/>
    </div> 
  ) 
}

export default Home          