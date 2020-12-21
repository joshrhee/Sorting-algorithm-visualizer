import React from "react"
import Head from 'next/head'
import InsertionSort from '../components/insertionSort'
//import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Visualized Sort Algorithm</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1 className='title'>Visualized Sort Algorithm</h1>

        <p className='description'>
          Get started by editing{' '}
          <code>pages/index.js</code>
        </p>
        
        <InsertionSort/>
          
      </div>
      
      <style jsx> {`
        .hero {
          width: 100%;
          color: #333;
        }
        .title {
          margin: 0;
          width: 100%
          padding-top: 80px;
          line-height: 1.15;
          font-size: 48px;
        }
        .title,
        .description {
          text-align: center;
        }
      `}  
      </style>
      
    </div>
  )
}
