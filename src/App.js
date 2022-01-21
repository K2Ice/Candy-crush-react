import React, { useCallback, useEffect, useState } from 'react'

import Result from './Result';

import blue from './pic/blue.jpg';
import yellow from './pic/yellow.jpg';
import red from './pic/red.jpg';
import purple from './pic/purple.jpg';
import orange from './pic/orange.jpg';
import green from './pic/green.jpg';

const width= 8;
const candyColors = [
  blue, green, orange, purple, red, yellow
]

const App = () =>{

  const [currentColorsArrangement, setCurrentColorsArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null)
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
  const [points, setPoints] = useState(0)

  const checkForRowOfFour = useCallback((check = false)=> {
    let moveCanBeDone = false;
    for(let i = 0; i<64; i++){
      const rowOfFour = [i, i + 1, i + 2, i+3]
      const decidedColor = currentColorsArrangement[i];
      const notValid = [5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,62,63,64]

      if(notValid.includes(i)) continue;

      if(rowOfFour.every(square => currentColorsArrangement[square]===decidedColor)){
        if(check) moveCanBeDone = 2;
        else rowOfFour.forEach(square => currentColorsArrangement[square] = '')
      }
    }
    return moveCanBeDone;

  },[currentColorsArrangement])
  
  const checkForColumnOfFour = useCallback( (check = false)=> {
    let moveCanBeDone = false;
    for(let i = 0; i<=39; i++){
      const columnOfFour = [i, i + width, i + (width *2), i + (width *3)]
      const decidedColor = currentColorsArrangement[i];

      if(columnOfFour.every(square => currentColorsArrangement[square]===decidedColor)){
        if(check) moveCanBeDone = 2;
        else columnOfFour.forEach(square => currentColorsArrangement[square] = '')
      }
    }
    return moveCanBeDone;
  }, [currentColorsArrangement])

  const checkForRowOfThree = useCallback((check = false)=> {
    let moveCanBeDone = false;

    for(let i = 0; i<64; i++){
      const rowOfThree = [i, i + 1, i + 2]
      const decidedColor = currentColorsArrangement[i];
      const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,63,64]

      if(notValid.includes(i)) continue;

      if(rowOfThree.every(square => currentColorsArrangement[square]===decidedColor)){
        if(check)moveCanBeDone = 1;
        else rowOfThree.forEach(square => currentColorsArrangement[square] = '')
      }
    }
    return moveCanBeDone;

  },[currentColorsArrangement])

  const checkForColumnOfThree = useCallback( (check = false)=> {
    let moveCanBeDone = false;

    for(let i = 0; i<=47; i++){
      const columnOfThree = [i, i + width, i + (width *2)]
      const decidedColor = currentColorsArrangement[i];

      if(columnOfThree.every(square => currentColorsArrangement[square]===decidedColor)){
        if(check)moveCanBeDone = 1;
        else columnOfThree.forEach(square => currentColorsArrangement[square] = '')
      }
    }
    return moveCanBeDone;

  },[currentColorsArrangement])
  
  const moveIntoSquareBelow = useCallback( (check = false)=>{
    for(let i =0; i<=55; i++){

      const firstRow = [0,1,2,3,4,5,6,7];
      const isFirstRow = firstRow.includes(i)

      if(isFirstRow && currentColorsArrangement[i]===""){
        const randomNumber = Math.floor(Math.random() * candyColors.length);
        currentColorsArrangement[i] = candyColors[randomNumber];
      }

      if(currentColorsArrangement[i + width] === ""){
        currentColorsArrangement[i + width] = currentColorsArrangement[i];
        currentColorsArrangement[i] = ""
      }
    }
  }, [currentColorsArrangement])

  const createBoard = ()=>{
    const randomColorArrangement = [];
    for(let i=0; i< width * width; i++){
      const randomColor =candyColors[ Math.floor(Math.random() * candyColors.length)];
      randomColorArrangement.push(randomColor);
    }
    setCurrentColorsArrangement(randomColorArrangement);
  }

useEffect(createBoard,[])

useEffect(()=>{
  const timer = setInterval(()=>{
    checkForColumnOfFour()
    checkForRowOfFour()
    checkForColumnOfThree()
    checkForRowOfThree()
    moveIntoSquareBelow()
    setCurrentColorsArrangement([...currentColorsArrangement])
  }, 100)

  return()=>clearInterval(timer)},
  [checkForColumnOfFour,checkForRowOfFour,checkForRowOfThree,checkForColumnOfThree,moveIntoSquareBelow,currentColorsArrangement])

  const dragStart = (e)=>{
    setSquareBeingDragged(e.target)
  }

  const dragDrop = (e)=>{
    setSquareBeingReplaced(e.target)
   
  }
  const dragEnd = ()=>{

    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

    currentColorsArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src');
    currentColorsArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src');

    const validMoves = [
      squareBeingDraggedId - 1, 
      squareBeingDraggedId - width, 
      squareBeingDraggedId + 1, 
      squareBeingDraggedId + width
    ]

    const validMove = validMoves.includes(squareBeingReplacedId);

    if(validMove){

      const isAColumnOfFour = checkForColumnOfFour(true)
      const isARowOfFour = checkForRowOfFour(true)
      const isAColumnOfThree = checkForColumnOfThree(true)
      const isARowOfThree = checkForRowOfThree(true)
      
      const earnedPoints =  isAColumnOfFour || isARowOfFour || isAColumnOfThree || isARowOfThree

      if(squareBeingReplacedId && validMove && earnedPoints){
        setSquareBeingDragged(null);
        setSquareBeingReplaced(null);
        setPoints(prevValue => prevValue + earnedPoints )
      }
      else{
        currentColorsArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src');
        currentColorsArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src');
      }
    }
  
    if(!validMove){
      currentColorsArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src');
      currentColorsArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src');
    }
    setCurrentColorsArrangement([...currentColorsArrangement])
  } 

  return (
    <div className='app'>
      <h1>Candy Crush Game</h1>
      <Result points={points}/>
      <div className="game">
        {currentColorsArrangement.map((candyColor,index) => (
        <img
        src={candyColor}
        key={index}
        alt={candyColor}
        data-id = {index}
        draggable={true}
        onDragOver={(e)=> e.preventDefault()}
        onDragEnter={(e)=> e.preventDefault()}
        onDragLeave={(e)=> e.preventDefault()}
        onDragStart={dragStart}
        onDrop={dragDrop}
        onDragEnd={dragEnd}
        />
        
        ))}
      </div>
    </div>
  );
}

export default App;
