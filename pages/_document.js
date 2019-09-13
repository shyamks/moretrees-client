import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import flush from 'styled-jsx/server';

import Footer from '../components/Footer';

export default class MyDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    const jsxStyles = flush()
    return { ...page, styleTags, jsxStyles }
  }

  render () {
    return (
      <html style={{ height: '100%'}}>
        <Head>
          <style>{`
            #__next { height: 100% }
          `}
          </style>
          {this.props.styleTags}
        </Head>
        <NextScript />
        <body style={{ margin: 0 }}>
          <Main />
        </body>
        <Footer/>
      </html>
    )
  }
}