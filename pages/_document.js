import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import Footer from '../components/Footer';

export default class MyDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
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
        <body style={{ height: '100%', margin: 0}}>
          <Main />
          <Footer/>
        </body>
      </html>
    )
  }
}