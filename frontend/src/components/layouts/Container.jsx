import React from 'react'

const Container = ({children, className}) => {
  return (
    <div className={`max-w-330 mx-auto px-4 md:px-6 lg:px-0 ${className}`}>
      {children}
    </div>
  )
}

export default Container;