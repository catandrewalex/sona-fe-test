import React from "react";
import Head from "next/head";

/**
 * PageInfo component prop types.
 * @typedef {Object} AppProviderProps
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @property {string} [title] the page title (in <head>)
 * @property {string} [description] the page description (in <meta>)
 * @property {(JSX.Element|JSX.Element[])} [children] the children of this component
 */
type PageInfoProps = {
  title?: string;
  description?: string;
  children?: JSX.Element | JSX.Element[];
};

/**
 * Component for <head> element that can be used to provide external css, scripts, or other meta like keywords, description, etc.
 * This component is used internally by PageContainer (@see PageContainer).
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @props PageInfoProps
 */
const PageInfo = ({ title, description, children }: PageInfoProps): JSX.Element => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {children}
    </Head>
  );
};

export default PageInfo;
