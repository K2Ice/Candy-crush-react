import React from 'react';

const Result = ({points}) => {
  return ( <>
    <div className='points'>
      <span>Punkty:</span>
      <span>{points}</span>
    </div>
  </> );
}
 
export default Result;