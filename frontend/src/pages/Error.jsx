import React from 'react'
import PageBanner from '../components/common/PageBanner'
import Notfound from '../assets/images/404.png'
import { Link } from 'react-router'

const Error = () => {
  return (
    <div>
      <PageBanner
        items={[
          "404 Error Page"
        ]}
      />

      <div className="py-20">
        <div className="font-pop">
          <img src={Notfound} alt="404" className='mx-auto' />
        </div>
        <div className="font-pop text-center max-w-150 mx-auto">
          <h2 className="pt-8 pb-5 text-[40px] font-semibold leading-[120%] text-logoc">
            Oops! page not found
          </h2>

          <p className="pb-9.5 text-base leading-[150%] text-normal text-gryd">
            Ut consequat ac tortor eu vehicula. Aenean accumsan purus eros.
            Maecenas sagittis tortor at metus mollis.
          </p>

          <Link to="/" className="inline-block py-3.5 px-8 text-[14px] leading-[120%] text-white bg-primary rounded-[43px]" >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Error;
