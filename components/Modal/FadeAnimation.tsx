import React from "react";
import { animated, useSpring } from "react-spring";

interface FadeProps {
  children?: React.ReactElement;
  in: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onEnter?: () => {};
  // eslint-disable-next-line @typescript-eslint/ban-types
  onExited?: () => {};
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(props, ref) {
  // eslint-disable-next-line react/prop-types
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    }
  });

  return (
    <animated.div ref={ref} style={{ ...style, outline: "none" }} {...other}>
      {children}
    </animated.div>
  );
});

export default Fade;
