import React from 'react'

function LoadingSkeleton() {
  return (
    <div>
        <div className='animate-pulse bg-white rounded-2xl shadow p-4'>
            <div className='h-40 bg-gray-200 rounded mb-4'></div>
            <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
            <div className='h-4 bg-gray-200 rounded w-1/2 mb-2'></div>
        </div>

    </div>
  )
}

export default LoadingSkeleton;