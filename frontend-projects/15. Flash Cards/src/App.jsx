import React from 'react'
import FlashCardContainer from './components/FlashCardContainer'

const App = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center font-hand gap-5 bg-gray-200">


      <div >
        <h1 className='text-4xl  mb-5 '>Flash Cards: Basics Of Economics</h1>
        <FlashCardContainer  />
      </div>
      <footer className=' text-3xl'>Made by Darth</footer>
    </div>       
  )
}

export default App
