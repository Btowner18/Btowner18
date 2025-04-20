import React from 'react';
import './App.css';

function Learn() {
  return (
    <div className="LearnPage" style={{ maxWidth: 800, margin: '80px auto 32px auto', background: 'rgba(30,30,40,0.96)', borderRadius: 16, padding: 32, boxShadow: '0 2px 24px #000a', color: '#fff' }}>
      <h2 className="fade-in" style={{ color: '#9B59B6' }}>Welcome to Crypto Portfolio Optimizer</h2>
      <p className="fade-in">
        <b>Crypto Portfolio Optimizer</b> is a comprehensive web application that empowers you to build, analyze, and optimize cryptocurrency portfolios using advanced financial analytics, interactive visualizations, and AI-powered assistance. This guide will help you understand every feature and how to use the app to its fullest potential.
      </p>
      <h3 className="fade-in" style={{ color: '#9B59B6' }}>Core Features</h3>
      <ul className="fade-in">
        <li><b>Portfolio Optimizer:</b> Select your favorite cryptocurrencies, set your investment amount, risk aversion, and time period. The app uses historical price data from Yahoo Finance to optimize your portfolio for the best risk-adjusted return using Modern Portfolio Theory.</li>
        <li><b>Efficient Frontier:</b> Visualize the set of optimal portfolios for your selected cryptos, showing the best possible return for each level of risk. The optimal portfolio is highlighted for easy comparison.</li>
        <li><b>Risk Metrics:</b> Instantly see your portfolio's expected return, volatility (risk), Sharpe ratio, and a detailed breakdown of how much each asset contributes to total risk.</li>
        <li><b>Allocation Breakdown:</b> View both a table and a pie chart showing how your investment is distributed across each crypto, in both percentages and dollar amounts.</li>
        <li><b>Price History:</b> Interactive charts display historical price data for all selected cryptos over your chosen time period.</li>
        <li><b>Projection:</b> See a 12-month projection of your investment under expected, optimistic, and pessimistic scenarios, based on the optimized portfolio's statistics.</li>
        <li><b>Backtest:</b> Simulate how your optimized portfolio would have performed historically, including total return, max drawdown, and annualized volatility.</li>
        <li><b>Monte Carlo Simulation:</b> Explore thousands of possible future portfolio paths using realistic geometric mean drift, showing a range of outcomes and probabilities for your investment after 12 months.</li>
        <li><b>Crypto News:</b> Stay up to date with the latest cryptocurrency news, fetched live from CoinStats.</li>
        <li><b>AI Optimizer Chat:</b> Get instant help, explanations, and portfolio advice from an AI assistant trained in crypto and portfolio optimization. Choose from several advanced AI models for your chat experience.</li>
      </ul>
      <h3 className="fade-in" style={{ color: '#9B59B6' }}>How to Use the App</h3>
      <ol className="fade-in">
        <li><b>Portfolio Optimizer:</b> On the main page, select your cryptos, set the date range, risk aversion (1 = risk-seeking, 10 = risk-averse), and investment amount. Click <b>Optimize</b> to generate your optimal portfolio and see all analytics and charts.</li>
        <li><b>Learn:</b> Visit this page anytime for a full explanation of every feature and metric.</li>
        <li><b>AI Optimizer:</b> Go to the AI Optimizer tab to chat with the AI assistant. Ask questions about crypto, portfolio theory, or get help interpreting your results.</li>
        <li><b>News:</b> Check the News tab for the latest crypto headlines and market updates.</li>
      </ol>
      <h3 className="fade-in" style={{ color: '#9B59B6' }}>Key Metrics & Visualizations</h3>
      <ul className="fade-in">
        <li><b>Expected Return:</b> The average annual return you might expect, based on historical data.</li>
        <li><b>Volatility:</b> The standard deviation of annual returns, representing risk or uncertainty.</li>
        <li><b>Sharpe Ratio:</b> A measure of risk-adjusted return. Higher is better.</li>
        <li><b>Risk Contribution:</b> Shows how much each asset contributes to total portfolio risk, helping you identify risk drivers.</li>
        <li><b>Allocation:</b> The percentage and dollar amount of your investment assigned to each crypto.</li>
        <li><b>Efficient Frontier:</b> A curve showing the best possible return for each risk level.</li>
        <li><b>Projection:</b> 12-month forecast under different scenarios (expected, optimistic, pessimistic).</li>
        <li><b>Backtest:</b> Simulated historical performance of your optimized portfolio, including key risk/return stats.</li>
        <li><b>Monte Carlo Simulation:</b> Thousands of simulated future paths, showing the range of possible outcomes and probabilities.</li>
      </ul>
      <h3 className="fade-in" style={{ color: '#9B59B6' }}>AI Chat Assistant</h3>
      <p className="fade-in">
        The AI Optimizer chat can answer questions about crypto, portfolio theory, risk, and the app itself. It can help you interpret results, explain financial concepts, and provide guidance on building a diversified portfolio. Choose from several advanced AI models for different chat experiences.
      </p>
      <h3 className="fade-in" style={{ color: '#9B59B6' }}>Crypto News</h3>
      <p className="fade-in">
        Stay informed with the latest cryptocurrency news, fetched live from CoinStats. This helps you keep up with market trends and events that may impact your portfolio.
      </p>
      <h3 className="fade-in" style={{ color: '#9B59B6' }}>Disclaimer</h3>
      <p className="fade-in">
        This tool is for educational and informational purposes only. Cryptocurrency investing is risky and past performance does not guarantee future results. Always do your own research and consult a financial advisor before investing.
      </p>
      <h3 className="fade-in" style={{ color: '#9B59B6' }}>Credits & Technology</h3>
      <ul className="fade-in">
        <li>Data: Yahoo Finance via <b>yfinance</b> (Python)</li>
        <li>Optimization: <b>scipy.optimize</b> (Python)</li>
        <li>Charts: <b>Recharts</b> (React), <b>matplotlib</b> (Python)</li>
        <li>News: <b>CoinStats API</b></li>
        <li>AI Chat: <b>OpenRouter</b> (multiple models)</li>
        <li>Backend: <b>FastAPI</b> (Python)</li>
        <li>Frontend: <b>React</b> (JavaScript)</li>
      </ul>
    </div>
  );
}

export default Learn;
