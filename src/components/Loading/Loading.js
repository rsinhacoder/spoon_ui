import React from 'react'
import loading from "../../assets/loading.gif"

const Loading = () => {
  return (
    <div className='w-[100vw] h-[100vh] flex items-center justify-center'>
      <img src={loading} className="w-[15rem]" alt='loading' />
    </div>
  )
}

export default Loading