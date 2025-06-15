

export const stringToColour = (str: string) => {
    let hash = 0;
    str.split("").forEach((char) => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });
    let colour = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      colour += value.toString(16).padStart(2, "0");
    }
    return colour;
  };
  

export const formatTick = (tick: string | number) => {
    if (typeof tick === "number") {
        if (tick >= 1_000_000_000_000) {
            return `${(tick / 1_000_000_000_000).toFixed(0)}T`;
        } else if (tick >= 1_000_000_000) {
            return `${(tick / 1_000_000_000).toFixed(0)}B`;
        } else if (tick >= 1_000_000) {
            return `${(tick / 1_000_000).toFixed(0)}M`;
        } else if (tick >= 1_000) {
            return `${(tick / 1_000).toFixed(0)}K`;
        } else {
            return tick.toLocaleString();
        }  }
    if (typeof tick === "string") {
        const date = new Date(tick);
        if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
        }
    }
    return tick;
}