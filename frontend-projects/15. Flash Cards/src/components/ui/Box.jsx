import React from 'react'

const Box = ({children, className = ""}) => {
  return (
    <div className={`border-2 border-gray-600 rounded-md p-1 ${className}`}>
        {children}
    </div>
  )
}

export default Box