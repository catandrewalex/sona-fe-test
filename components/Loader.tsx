import React, { useEffect, useState } from "react";
import Image from "next/image";
import { animated, useSpring } from "@react-spring/web";
import clsx from "clsx";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { CircularProgress } from "@mui/material";

/**
 * Loader component prop types.
 * @typedef {Object} LoaderPropsType
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @property {boolean} [animation=false] indicate whether the fade animation will be aplied to the loader or not
 */
type LoaderPropsType = {
  animation?: boolean;
  testIdContext?: string;
};

/**
 * The main loading animation that shows logo and indeterminate
 * circular progress.
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @props LoaderPropsType
 */
const Loader = ({ animation = false, testIdContext }: LoaderPropsType): JSX.Element => {
  const finishAppLoading = useApp((state) => state.appFinishLoading);
  const [loaderVisible, setLoaderVisible] = useState(!animation);
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    config: { duration: 2000 },
    onRest: () => setLoaderVisible(true)
  });

  useEffect(() => {
    if (animation) {
      const timeout = setTimeout(finishAppLoading, 1000);
      return () => clearTimeout(timeout);
    }
  }, [animation, finishAppLoading]);

  return (
    <>
      <animated.div
        style={animation ? props : {}}
        className="container"
        data-testid={`${testIdContext}-Loader`}
      >
        <Image unoptimized src="/logo.png" width="500" height="287" />
        <CircularProgress
          className={clsx("m-5", {
            "hide-visual": !loaderVisible
          })}
        />
      </animated.div>
    </>
  );
};

export default Loader;
