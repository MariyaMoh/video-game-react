import { motion } from "framer-motion";
import styles from "./CardBlock.module.css";
export default function CardBlock({ card, handleSelect, flipped }) {
  const handleClick = () => {
    handleSelect(card);
  };

  return (
    <motion.div
      className={styles.card}
      transition={{ type: "spring", velocity: 10, stiffness: 30 }}
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
    >
      <div className={flipped ? styles.flipped : ""}>
        <img className={styles.fronOfCard} src={card.src} alt="" />
        <img
          className={styles.backOfCard}
          src="/images/cover.jpg"
          onClick={handleClick}
          alt=""
        />
      </div>
    </motion.div>
  );
}
