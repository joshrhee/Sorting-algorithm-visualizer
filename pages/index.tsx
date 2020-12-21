import React from "react"
import Head from 'next/head'
import InsertionSort from '../components/insertionSort'
//import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p>
          Get started by editing{' '}
          <code>pages/index.js</code>
        </p>
        
        <InsertionSort/>
        
      </main>

      
    </div>
  )
}
