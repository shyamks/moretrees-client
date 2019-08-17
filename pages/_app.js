import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
// import { ThemeProvider } from '@material-ui/styles';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import { GlobalStyle } from '../css/global';
// import theme from '../css/theme';

export default class MyApp extends App {
  componentDidMount () {
    const jssStyles = document.querySelector ('#jss-server-side');

    if (jssStyles) {
      jssStyles.parentNode.removeChild (jssStyles);
    }
  }

  render () {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <React.StrictMode>
            <Component {...pageProps} />
        </React.StrictMode>
      </Container>
    );
  }
}