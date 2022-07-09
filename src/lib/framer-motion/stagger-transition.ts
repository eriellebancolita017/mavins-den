export function staggerTransition(staggerChildren: number = 0.05) {
  return {
    enter: {
      transition: { staggerChildren },
    },
    exit: {
      transition: { staggerChildren },
    },
  };
}
