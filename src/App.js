import { useEffect, useReducer } from "react";
import "./styles.css";
import styles from "./App.module.css";
import CardBlock from "./components/CardBlock";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
//1-array od cards
//each object with prpb(src)
const ArrayofImages = [
  { src: "/images/img-1.jpg", matched: false },
  { src: "/images/img-2.jpg", matched: false },
  { src: "/images/img-3.jpg", matched: false },
  { src: "/images/img-4.jpg", matched: false },
  { src: "/images/img-5.jpg", matched: false },
  { src: "/images/img-6.jpg", matched: false }
];

const initialState = {
  cards: [],
  turns: 0,
  cardOne: null,
  cardTwo: null,
  numberOfGuess: 0,
  isFinish: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case "RESET":
      return {
        ...state,
        isFinished: false,
        cardOne: null,
        cardTwo: null,
        turns: state.turns + 1
      };
    case "SELECT": {
      if (state.cardOne) {
        let cards = state.cards;
        if (state.cardOne === action.card) {
          cards = cards.map((card) => {
            if (card.src === state.cardOne.src) {
              return {
                ...card,
                matched: true,
                numberOfGuess: state.numberOfGuess + 1
              };
            } else {
              return card;
            }
          });
        }
        let isFinished = false;
        if (cards.every((card) => card.matched)) {
          isFinished = true;
        }
        return { ...state, cards, isFinished, cardTwo: action.card };
      } else {
        return { ...state, cardOne: action.card };
      }
    }

    case "RESTART":
      const shuffleCards = [...ArrayofImages, ...ArrayofImages]
        //3-shuffle imgs and give random id
        //if the num is - will be in same order or palce
        //if num is + 1 will switch (shuffle)
        .sort(() => Math.random() - 0.5)
        //give random id for each
        .map((card) => ({ ...card, id: Math.random() }));
      //this is when i click to new game

      return {
        ...initialState,
        cards: shuffleCards
      };

    default:
      return state;
  }
};

export default function App() {
  //4-craete state

  const [state, dispatch] = useReducer(reducer, initialState);
  const { cardOne, cardTwo, cards, isFinished } = state;

  const handleSelect = (card) => {
    dispatch({ type: "SELECT", card });
  };

  useEffect(() => {
    if (cardOne && cardTwo) {
      if (cardOne.src === cardTwo.src) {
        handleSelect(cardOne);
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [cardOne, cardTwo, cards]);

  const resetTurn = () => {
    dispatch({ type: "RESET" });
  };

  const newGame = () => {
    dispatch({ type: "RESTART" });
  };

  const { width, height } = useWindowSize();

  return (
    <div className="App">
      <motion.h1
        className={styles.heading}
        initial={{ y: -300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 300, opacity: 0 }}
      >
        Magic Match
      </motion.h1>

      <button className={styles.button} onClick={newGame}>
        New Game
      </button>

      <motion.div className={styles.card_grid}>
        {cards.map((card) => (
          <CardBlock
            key={card.id}
            card={card}
            handleSelect={handleSelect}
            flipped={card === cardOne || card === cardTwo || card.matched}
          />
        ))}
      </motion.div>

      <div>
        {isFinished ? (
          <>
            <h2>Congrates</h2>
            <Confetti width={width} height={height} />
          </>
        ) : null}
      </div>
    </div>
  );
}
