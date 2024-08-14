import GridsCanvas from './GridsCanvas';
// import { useEffect, useState, } from 'react';
// import { getGamesMetadata, getGameById } from '../dataAdapters/gameCanvasAdapter';



function GameCanvas() {
  // const [gamesMetadata, setGamesMetadata] = useState([]);
  // const [currentGame, setCurrentGame] = useState(null);

  // useEffect(() => {
  //   const fetchGamesMetadata = async () => {
  //     try {
  //       const data = await getGamesMetadata();
  //       setGamesMetadata(data);
  //     } catch (error) {
  //       console.error('Error fetching games metadata:', error);
  //     }
  //   };
  //
  //   fetchGamesMetadata();
  // }, []);
  //
  // const loadGame = async (gameId: string) => {
  //   try {
  //     const game = await getGameById(gameId);
  //     setCurrentGame(game);
  //   } catch (error) {
  //     console.error(`Error loading game with ID ${gameId}:`, error);
  //   }
  // };

  return (
    <>
      <div>
        <h3>Game Canvas</h3>
          <GridsCanvas/>
        {/*{currentGame ? (*/}
        {/*  <GridsCanvas gameData={currentGame} />*/}
        {/*) : (*/}
        {/*  <div>*/}
        {/*    {gamesMetadata.map((game) => (*/}
        {/*      <button key={game.id} onClick={() => loadGame(game.id)}>*/}
        {/*        {game.name}*/}
        {/*      </button>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    </>
  )
}

export default GameCanvas