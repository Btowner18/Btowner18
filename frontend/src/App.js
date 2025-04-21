import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell
} from 'recharts';
import Select from 'react-select';
import Learn from './Learn';
import ChatAssistant from './ChatAssistant';
import News from './News';

const TICKER_OPTIONS = [
  'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'DOT', 'MATIC', 'LTC', 'BCH', 'LINK', 'XLM', 'TRX', 'AVAX', 'UNI', 'ATOM', 'ETC', 'FIL', 'ICP', 'APT', 'HBAR', 'VET', 'MKR', 'QNT', 'AAVE', 'SAND', 'EGLD', 'XTZ', 'THETA', 'AXS', 'MANA', 'KLAY', 'NEAR', 'GRT', 'ALGO', 'EOS', 'FLOW', 'CHZ', 'CAKE', 'XEC', 'CRV', 'KSM', 'ENJ', 'ZIL', '1INCH', 'BAT', 'COMP', 'REN', 'SNX', 'YFI', 'ZRX'
].map(ticker => ({ value: ticker, label: ticker }));

const MODEL_OPTIONS = [
  { value: 'deepseek/deepseek-chat-v3-0324:free', label: 'DeepSeek Chat v3' },
  { value: 'google/gemini-2.0-flash-exp:free', label: 'Gemini 2.0 Flash' },
  { value: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free', label: 'Llama 3.1 Nemotron Ultra' },
];

function Stars({ count = 80 }) {
  // Generate random stars only once
  const [stars] = useState(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2,
    }))
  );
  return (
    <div className="stars">
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            top: `${star.top}vh`,
            left: `${star.left}vw`,
            width: star.size,
            height: star.size,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function ShootingStars({ count = 3 }) {
  const [stars] = useState(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: Math.random() * 80 + 5, // 5vh to 85vh
      left: Math.random() * 80 + 5, // 5vw to 85vw
      delay: Math.random() * 8,
      duration: 1.8 + Math.random() * 1.2,
    }))
  );
  return (
    <>
      {stars.map(star => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: `${star.top}vh`,
            left: `${star.left}vw`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </>
  );
}

function App() {
  const [tickers, setTickers] = useState([
    { value: 'BTC', label: 'BTC' },
    { value: 'ETH', label: 'ETH' },
    { value: 'BNB', label: 'BNB' }
  ]);
  const [startDate, setStartDate] = useState('2015-01-01');
  const [endDate, setEndDate] = useState('2025-01-01');
  const [riskAversion, setRiskAversion] = useState(5);
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState('main');
  const [showResults, setShowResults] = useState(true);

  // Inline validation state
  const [formErrors, setFormErrors] = useState({});

  const inputTooltips = {
    tickers: 'Select one or more cryptocurrencies to include in your portfolio.',
    startDate: 'The start date for historical price data (earliest: 2015-01-01).',
    endDate: 'The end date for historical price data.',
    riskAversion: 'A higher value means you prefer less risk (1 = risk-seeking, 10 = very risk-averse).',
    investmentAmount: 'The total amount (in USD) to allocate across your portfolio.'
  };

  const resultTooltips = {
    expected_return: 'The average annual return you might expect from the optimized portfolio, based on historical data.',
    volatility: 'The standard deviation of annual returns, representing the risk or uncertainty of the portfolio.',
    sharpe_ratio: 'A measure of risk-adjusted return. Higher values indicate better risk-adjusted performance.',
    allocation: 'How your investment is distributed across each crypto in the portfolio.',
    allocation_pie: 'A visual breakdown of your portfolio allocation by crypto.',
    price_history: 'Historical price data for each selected crypto over the chosen time period.',
    efficient_frontier: 'A curve showing the best possible return for each risk level, based on your selected cryptos.',
    projection: 'A 12-month projection of your investment under expected, optimistic, and pessimistic scenarios.',
    backtest: 'Simulates how the optimized portfolio would have performed historically, using the actual price data and optimal weights. Shows portfolio value over time and key risk/return stats.'
  };

  useEffect(() => {
    // Parallax effect for planets
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const planet1 = document.querySelector('.planet1');
      const planet2 = document.querySelector('.planet2');
      if (planet1) {
        planet1.style.transform = `translateY(${30 + scrollY * 0.08}px) scale(1.05)`;
      }
      if (planet2) {
        planet2.style.transform = `translateY(${-24 - scrollY * 0.06}px) scale(1.08)`;
      }
    };
    document.body.setAttribute('data-parallax', 'true');
    window.addEventListener('scroll', handleScroll);
    // Rocket launch sound on load, with fallback on first user interaction
    const audio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5b2.mp3');
    audio.volume = 0.25;
    let played = false;
    const tryPlay = () => {
      if (!played) {
        audio.play().catch(() => {});
        played = true;
      }
    };
    // Try to play immediately
    setTimeout(tryPlay, 400);
    // Fallback: play on first user interaction
    const playOnUser = () => {
      tryPlay();
      window.removeEventListener('pointerdown', playOnUser);
      window.removeEventListener('keydown', playOnUser);
    };
    window.addEventListener('pointerdown', playOnUser);
    window.addEventListener('keydown', playOnUser);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.removeAttribute('data-parallax');
      window.removeEventListener('pointerdown', playOnUser);
      window.removeEventListener('keydown', playOnUser);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!tickers || tickers.length === 0) errors.tickers = 'Please select at least one crypto.';
    if (!startDate) errors.startDate = 'Start date is required.';
    if (!endDate) errors.endDate = 'End date is required.';
    if (startDate && endDate && startDate > endDate) errors.endDate = 'End date must be after start date.';
    if (!riskAversion || riskAversion < 1 || riskAversion > 10) errors.riskAversion = 'Risk aversion must be between 1 and 10.';
    if (!investmentAmount || investmentAmount <= 0) errors.investmentAmount = 'Investment amount must be positive.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('https://btowner18.onrender.com/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tickers: tickers.map(t => t.value),
          start_date: startDate,
          end_date: endDate,
          risk_aversion: riskAversion,
          investment_amount: investmentAmount
        })
      });
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTickers([
      { value: 'BTC', label: 'BTC' },
      { value: 'ETH', label: 'ETH' },
      { value: 'BNB', label: 'BNB' }
    ]);
    setStartDate('2015-01-01');
    setEndDate('2025-01-01');
    setRiskAversion(5);
    setInvestmentAmount(10000);
    setResult(null);
    setError(null);
    setShowResults(true);
    setFormErrors({});
  };

  // Add state and handler for chat
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0].value);
  const [chatStopped, setChatStopped] = useState(false);
  const [chatAbortController, setChatAbortController] = useState(null); // NEW: store AbortController
  const chatContainerRef = React.useRef(null);

  // Function to handle sending chat messages
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatStopped) return;
    const userMessage = { sender: 'user', text: chatInput.trim() };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    setChatLoading(true);
    setChatStopped(false);
    const controller = new AbortController();
    setChatAbortController(controller);
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 20000); // 20 seconds timeout
    try {
      const response = await fetch('https://btowner18.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text, model: selectedModel, history: chatMessages }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('Failed to get response from AI');
      const data = await response.json();
      setChatMessages(prevMessages => [
        ...prevMessages,
        { sender: 'ai', text: data.response }
      ]);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        setChatMessages(prevMessages => [
          ...prevMessages,
          { sender: 'ai', text: 'Chat stopped or timed out.' }
        ]);
      } else {
        setChatMessages(prevMessages => [
          ...prevMessages,
          { sender: 'ai', text: 'Sorry, I encountered an error. Please try again later.' }
        ]);
      }
    } finally {
      setChatLoading(false);
      setChatAbortController(null);
    }
  };

  // Handler for stop/resume button
  const handleStopChat = () => {
    if (!chatStopped && chatAbortController) {
      chatAbortController.abort();
    }
    setChatStopped(s => !s);
  };

  // Add function to initiate the chat with a greeting when chatbot page is opened
  useEffect(() => {
    if (page === 'chatbot' && chatMessages.length === 0) {
      setChatMessages([{
        role: 'assistant',
        content: "Hi there! I'm your AI Optimizer. I can help you build an optimized portfolio based on your preferences. What type of portfolio are you looking for today?"
      }]);
    }
  }, [page, chatMessages.length]);

  // Auto-scroll to bottom when chatMessages or chatLoading changes
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, chatLoading]);

  return (
    <>
      <Stars count={100} />
      <ShootingStars count={3} />
      <div className="sticky-header">
        <h1>Crypto Portfolio Optimizer</h1>
        <nav className="nav">
          <button 
            className={`nav-item ${page === 'main' ? 'active' : ''}`} 
            onClick={() => setPage('main')}
          >
            Portfolio Optimizer
          </button>
          <button 
            className={`nav-item ${page === 'learn' ? 'active' : ''}`} 
            onClick={() => setPage('learn')}
          >
            Learn
          </button>
          <button 
            className={`nav-item ${page === 'chatbot' ? 'active' : ''}`} 
            onClick={() => { setPage('chatbot'); if (page !== 'chatbot') setChatMessages([{ role: 'assistant', content: "Hi there! I'm your AI Optimizer. I can help you build an optimized portfolio based on your preferences. What type of portfolio are you looking for today?" }]); }}
          >
            AI Optimizer
          </button>
          <button
            className={`nav-item ${page === 'news' ? 'active' : ''}`}
            onClick={() => setPage('news')}
          >
            News
          </button>
        </nav>
      </div>

      <div className="content">
        {page === 'main' && (
          <div className="App fade-in">
            {/* Parallax Planets */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg"
              alt="Planet 1"
              className="planet planet1"
            />
            {/* Moon in top right */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg"
              alt="Moon"
              className="moon-bg"
            />
            <div className="doge-header" style={{ position: 'relative', width: '100%' }}>
              <img
                src="https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg"
                alt="Doge"
                className="doge-img"
              />
              <span className="moon-text">To the Moon!</span>
              <img
                src="https://em-content.zobj.net/source/microsoft-teams/363/rocket_1f680.png"
                alt="Rocket"
                className="rocket-fly"
                draggable="false"
                style={{ pointerEvents: 'none' }}
              />
            </div>
            {/* Removed duplicate <h1>Crypto Portfolio Optimizer</h1> */}
            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }} className="fade-in">
              {Object.keys(formErrors).length > 0 && (
                <div className="form-error-banner">
                  {Object.values(formErrors).map((msg, i) => (
                    <div key={i}>{msg}</div>
                  ))}
                </div>
              )}
              <div>
                <label>
                  Tickers:
                  <span
                    title={inputTooltips.tickers}
                    style={{ cursor: 'help', marginLeft: 6, color: '#9B59B6', fontWeight: 700 }}
                    aria-label="Tickers info"
                  >&#9432;</span>
                </label>
                <div style={{ minWidth: 220, marginBottom: 8 }}>
                  <Select
                    isMulti
                    options={TICKER_OPTIONS}
                    value={tickers}
                    onChange={setTickers}
                    closeMenuOnSelect={true}
                    placeholder="Select tickers..."
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        background: '#222',
                        color: '#fff',
                        border: formErrors.tickers ? '2px solid #e74c3c' : '1px solid #9B59B6',
                        borderRadius: 6,
                        boxShadow: formErrors.tickers ? '0 0 0 2px #e74c3c55' : undefined,
                      }),
                      menu: (base) => ({ ...base, background: '#232323', color: '#fff' }),
                      multiValue: (base) => ({ ...base, background: '#9B59B6', color: '#fff' }),
                      multiValueLabel: (base) => ({ ...base, color: '#fff' }),
                      option: (base, state) => ({
                        ...base,
                        background: state.isFocused ? '#9B59B6' : '#232323',
                        color: '#fff',
                      }),
                    }}
                  />
                  {formErrors.tickers && <div className="form-error-inline">{formErrors.tickers}</div>}
                </div>
              </div>
              <div>
                <label>
                  Start Date:
                  <span
                    title={inputTooltips.startDate}
                    style={{ cursor: 'help', marginLeft: 6, color: '#9B59B6', fontWeight: 700 }}
                    aria-label="Start date info"
                  >&#9432;</span>
                </label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={formErrors.startDate ? { border: '2px solid #e74c3c', boxShadow: '0 0 0 2px #e74c3c55' } : {}} />
                {formErrors.startDate && <div className="form-error-inline">{formErrors.startDate}</div>}
              </div>
              <div>
                <label>
                  End Date:
                  <span
                    title={inputTooltips.endDate}
                    style={{ cursor: 'help', marginLeft: 6, color: '#9B59B6', fontWeight: 700 }}
                    aria-label="End date info"
                  >&#9432;</span>
                </label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={formErrors.endDate ? { border: '2px solid #e74c3c', boxShadow: '0 0 0 2px #e74c3c55' } : {}} />
                {formErrors.endDate && <div className="form-error-inline">{formErrors.endDate}</div>}
              </div>
              <div>
                <label>
                  Risk Aversion:
                  <span
                    title={inputTooltips.riskAversion}
                    style={{ cursor: 'help', marginLeft: 6, color: '#9B59B6', fontWeight: 700 }}
                    aria-label="Risk aversion info"
                  >&#9432;</span>
                </label>
                <input type="number" value={riskAversion} min={1} max={10} onChange={e => setRiskAversion(Number(e.target.value))} style={formErrors.riskAversion ? { border: '2px solid #e74c3c', boxShadow: '0 0 0 2px #e74c3c55' } : {}} />
                {formErrors.riskAversion && <div className="form-error-inline">{formErrors.riskAversion}</div>}
              </div>
              <div>
                <label>
                  Investment Amount:
                  <span
                    title={inputTooltips.investmentAmount}
                    style={{ cursor: 'help', marginLeft: 6, color: '#9B59B6', fontWeight: 700 }}
                    aria-label="Investment amount info"
                  >&#9432;</span>
                </label>
                <input type="number" value={investmentAmount} onChange={e => setInvestmentAmount(Number(e.target.value))} style={formErrors.investmentAmount ? { border: '2px solid #e74c3c', boxShadow: '0 0 0 2px #e74c3c55' } : {}} />
                {formErrors.investmentAmount && <div className="form-error-inline">{formErrors.investmentAmount}</div>}
              </div>
              <button type="submit" disabled={loading}>Optimize</button>
              <button type="button" onClick={handleReset} style={{ marginLeft: 12, background: '#232323', color: '#fff', border: '1px solid #9B59B6', fontWeight: 500 }}>Reset</button>
            </form>
            {loading && (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '32px 0' }}>
                <div className="loader-spinner" style={{ marginBottom: 12 }}></div>
                <span style={{ color: '#9B59B6', fontWeight: 600, fontSize: '1.1rem' }}>Optimizing portfolio...</span>
              </div>
            )}
            {error && <p className="fade-in" style={{ color: 'red' }}>{error}</p>}
            {result && (
              <div className="Results fade-in">
                <div className="Results-section" style={{ minWidth: 220 }}>
                  <button
                    className="collapse-btn"
                    onClick={() => setShowResults(r => !r)}
                    style={{ marginBottom: 10, width: 'auto', fontSize: '0.95rem', fontWeight: 600, padding: '4px 14px', borderRadius: 6, minWidth: 0 }}
                    aria-expanded={showResults}
                  >
                    {showResults ? 'Hide Results ▲' : 'Show Results ▼'}
                  </button>
                  {showResults && (
                    <div>
                      <h2>Results
                        <span title="Summary of your optimized portfolio metrics." style={{ cursor: 'help', marginLeft: 8, color: '#9B59B6', fontWeight: 700 }} aria-label="Results info">&#9432;</span>
                      </h2>
                      <p>Expected Return: {result.expected_return.toFixed(4)}
                        <span title={resultTooltips.expected_return} style={{ cursor: 'help', marginLeft: 6, color: '#9B59B6', fontWeight: 700 }} aria-label="Expected return info">&#9432;</span>
                        <span style={{ marginLeft: 10, color: '#27ae60', fontWeight: 600 }}>
                          (${(result.expected_return * investmentAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})})
                        </span>
                      </p>
                      <p>Volatility: {result.volatility.toFixed(4)}
                        <span title={resultTooltips.volatility} style={{ cursor: 'help', marginLeft: 6, color: '#9B59B6', fontWeight: 700 }} aria-label="Volatility info">&#9432;</span>
                      </p>
                      <p>Sharpe Ratio: {result.sharpe_ratio.toFixed(4)}
                        <span title={resultTooltips.sharpe_ratio} style={{ cursor: 'help', marginLeft: 6, color: '#9B59B6', fontWeight: 700 }} aria-label="Sharpe ratio info">&#9432;</span>
                      </p>
                      {showResults && result.risk_contribution && (
                        <div style={{ margin: '18px 0 18px 0' }}>
                          <h3>Risk Contribution
                            <span title="Shows how much each asset contributes to the total risk (volatility) of your portfolio. Assets with higher risk contribution have a larger impact on overall portfolio risk, even if their allocation is small. This helps you identify which assets are driving your portfolio's risk profile." style={{ cursor: 'help', marginLeft: 6, color: '#9B59B6', fontWeight: 700 }} aria-label="Risk contribution info">&#9432;</span>
                          </h3>
                          <ul>
                            {Object.entries(result.risk_contribution).map(([ticker, rc]) => (
                              <li key={ticker}>
                                {ticker}: {(rc * 100).toFixed(2)}% of total risk
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <h3>Allocation
                        <span title={resultTooltips.allocation} style={{ cursor: 'help', marginLeft: 6, color: '#9B59B6', fontWeight: 700 }} aria-label="Allocation info">&#9432;</span>
                      </h3>
                      <ul>
                        {Object.entries(result.allocation).map(([ticker, weight]) => (
                          <li key={ticker}>
                            {ticker}: {(weight * 100).toFixed(2)}% (
                            ${(weight * investmentAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            )
                          </li>
                        ))}
                      </ul>
                      <div style={{ fontWeight: 600, marginTop: 8 }}>
                        Total: ${Object.values(result.allocation).reduce((sum, w) => sum + w * investmentAmount, 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </div>
                      {/* Pie Chart for Allocation (moved here) */}
                      {result.allocation && (
                        <div style={{ margin: '18px 0 32px 0' }}>
                          <h3>Allocation Pie Chart
                            <span title={resultTooltips.allocation_pie} style={{ cursor: 'help', marginLeft: 6, color: '#9B59B6', fontWeight: 700 }} aria-label="Allocation pie info">&#9432;</span>
                          </h3>
                          <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                              <Pie
                                data={Object.entries(result.allocation).map(([ticker, weight]) => ({
                                  name: ticker,
                                  value: weight * investmentAmount
                                }))}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                isAnimationActive={true}
                                animationDuration={900}
                                animationEasing="ease-out"
                              >
                                {Object.keys(result.allocation).map((_, idx) => (
                                  <Cell key={idx} fill={['#9B59B6', '#27ae60', '#e74c3c', '#f1c40f', '#2980b9', '#8e44ad', '#16a085', '#f39c12', '#d35400', '#2c3e50'][idx % 10]} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {showResults && (
                  <div className="Results-section">
                    {/* Price History Chart */}
                    {result.prices && Object.keys(result.prices).length > 0 && (
                      <div style={{ margin: '0 0 32px 0' }}>
                        <h3>Price History
                          <span title={resultTooltips.price_history} style={{ cursor: 'help', marginLeft: 6, color: '#9B59B6', fontWeight: 700 }} aria-label="Price history info">&#9432;</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={220}>
                          <LineChart data={Object.keys(result.prices[Object.keys(result.prices)[0]]).map((date, idx) => {
                            const row = { date };
                            Object.keys(result.prices).forEach(ticker => {
                              row[ticker] = result.prices[ticker][date];
                            });
                            return row;
                          })}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" minTickGap={30} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {Object.keys(result.prices).map(ticker => (
                              <Line key={ticker} type="monotone" dataKey={ticker} stroke="#9B59B6" dot={false} />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    {/* Efficient Frontier Chart with Optimal Portfolio */}
                    {result.efficient_frontier && result.efficient_frontier.length > 0 && (
                      <div style={{ margin: '0 0 32px 0' }}>
                        <h3>Efficient Frontier
                          <span title={resultTooltips.efficient_frontier} style={{ cursor: 'help', marginLeft: 6, color: '#9B59B6', fontWeight: 700 }} aria-label="Efficient frontier info">&#9432;</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={220}>
                          <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="volatility" name="Volatility" label={{ value: 'Volatility', position: 'insideBottom', offset: -5 }} tickFormatter={v => v.toFixed(2)} />
                            <YAxis dataKey="return" name="Return" label={{ value: 'Return', angle: -90, position: 'insideLeft' }} tickFormatter={v => v.toFixed(2)} />
                            <Tooltip formatter={v => v.toFixed(4)} />
                            <Legend />
                            {/* Efficient Frontier as a smooth line */}
                            <Line
                              type="monotone"
                              dataKey="return"
                              data={result.efficient_frontier}
                              stroke="#9B59B6"
                              dot={false}
                              strokeWidth={2}
                              name="Efficient Frontier"
                              isAnimationActive={true}
                              animationDuration={900}
                              animationEasing="ease-out"
                              connectNulls={true}
                            />
                            {/* Points for all portfolios on the efficient frontier */}
                            <Scatter
                              name="Portfolios"
                              data={result.efficient_frontier}
                              fill="#9B59B6"
                              shape="circle"
                            />
                            {/* Point for the optimal portfolio */}
                            <Scatter
                              name="Optimal Portfolio"
                              data={[{ volatility: result.volatility, return: result.expected_return }]}
                              fill="#27ae60"
                              shape="star"
                            />
                          </ScatterChart>
                        </ResponsiveContainer>
                        <div style={{marginTop: 8, color: '#27ae60', fontWeight: 600}}>
                          Optimal Portfolio: Volatility = {result.volatility.toFixed(4)}, Return = {result.expected_return.toFixed(4)}
                        </div>
                      </div>
                    )}
                    {/* Projection Chart */}
                    {result.projection && result.projection.months && (
                      <div style={{ margin: '0 0 32px 0' }}>
                        <h3>Projection (12 months)
                          <span title={resultTooltips.projection} style={{ cursor: 'help', marginLeft: 6, color: '#9B59B6', fontWeight: 700 }} aria-label="Projection info">&#9432;</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={220}>
                          <LineChart data={result.projection.months.map((m, i) => ({
                            month: m,
                            expected: result.projection.expected[i],
                            optimistic: result.projection.optimistic[i],
                            pessimistic: result.projection.pessimistic[i],
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="expected" stroke="#9B59B6" />
                            <Line type="monotone" dataKey="optimistic" stroke="#27ae60" />
                            <Line type="monotone" dataKey="pessimistic" stroke="#e74c3c" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    {/* Portfolio Backtest */}
                    {showResults && result.backtest && result.backtest.values && result.backtest.values.length > 1 && (
                      <div style={{ margin: '0 0 32px 0' }}>
                        <h3>Portfolio Backtest
                          <span title={resultTooltips.backtest} style={{ cursor: 'help', marginLeft: 6, color: '#9B59B6', fontWeight: 700 }} aria-label="Portfolio backtest info">&#9432;</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={220}>
                          <LineChart data={result.backtest.dates.map((date, i) => ({
                            date,
                            value: result.backtest.values[i]
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" minTickGap={30} />
                            <YAxis />
                            <Tooltip formatter={v => `$${Number(v).toLocaleString(undefined, {maximumFractionDigits: 2})}`} />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#27ae60" dot={false} name="Portfolio Value" />
                          </LineChart>
                        </ResponsiveContainer>
                        {result.backtest_stats && (
                          <div style={{ marginTop: 12, fontSize: '1.08rem', color: '#fff' }}>
                            <div>Total Return: <b style={{ color: '#27ae60' }}>{(result.backtest_stats.total_return * 100).toFixed(2)}%</b></div>
                            <div>Max Drawdown: <b style={{ color: '#e74c3c' }}>{(result.backtest_stats.max_drawdown * 100).toFixed(2)}%</b></div>
                            <div>Annualized Volatility: <b style={{ color: '#f1c40f' }}>{(result.backtest_stats.annualized_volatility * 100).toFixed(2)}%</b></div>
                          </div>
                        )}
                      </div>
                    )}
                    {showResults && result.monte_carlo && result.monte_carlo.paths && (
                      <div style={{ margin: '0 0 32px 0' }}>
                        <h3>Monte Carlo Simulation
                          <span title="Simulates thousands of possible future portfolio paths using the geometric mean (CAGR) as the drift, not the arithmetic mean. This gives a more realistic and representative range of outcomes, since compounding and volatility drag mean the median result is usually lower than the simple average return. The simulation shows a range of possible outcomes and probabilities for your investment after 12 months." style={{ cursor: 'help', marginLeft: 6, color: '#9B59B6', fontWeight: 700 }} aria-label="Monte Carlo info">&#9432;</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={220}>
                          <LineChart data={Array.from({length: result.monte_carlo.paths[0].length}, (_, t) => {
                            const obj = { month: t };
                            // Show a few sample paths
                            for (let i = 0; i < Math.min(10, result.monte_carlo.paths.length); ++i) {
                              obj[`sim${i+1}`] = result.monte_carlo.paths[i][t];
                            }
                            return obj;
                          })}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={v => `$${Number(v).toLocaleString(undefined, {maximumFractionDigits: 2})}`} />
                            <Legend />
                            {[...Array(Math.min(10, result.monte_carlo.paths.length)).keys()].map(i => (
                              <Line key={i} type="monotone" dataKey={`sim${i+1}`} stroke="#9B59B6" dot={false} strokeWidth={1} opacity={0.35} />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                        {result.monte_carlo.percentiles && (
                          <div style={{ marginTop: 12, fontSize: '1.08rem', color: '#fff' }}>
                            <div>10th Percentile: <b style={{ color: '#e74c3c' }}>${Number(result.monte_carlo.percentiles.p10).toLocaleString(undefined, {maximumFractionDigits: 2})}</b></div>
                            <div>Median: <b style={{ color: '#27ae60' }}>${Number(result.monte_carlo.percentiles.p50).toLocaleString(undefined, {maximumFractionDigits: 2})}</b></div>
                            <div>90th Percentile: <b style={{ color: '#f1c40f' }}>${Number(result.monte_carlo.percentiles.p90).toLocaleString(undefined, {maximumFractionDigits: 2})}</b></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {page === 'learn' && <Learn />}

        {page === 'chatbot' && (
          <section className="chatbot-section">
            <h2>AI Optimizer</h2>
            <p className="intro-text">Chat with our AI Optimizer to get help with portfolio optimization, crypto questions, and investment advice.</p>
            <div style={{ marginBottom: 12, maxWidth: 400 }}>
              <label htmlFor="model-select" style={{ fontWeight: 600, color: '#9B59B6' }}>AI Model:</label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                style={{ marginLeft: 8, padding: '4px 8px', borderRadius: 6, border: '1px solid #9B59B6', background: '#232323', color: '#fff', fontWeight: 500 }}
                disabled={chatStopped}
              >
                {MODEL_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="chat-container" ref={chatContainerRef} style={{ maxHeight: 400, overflowY: 'auto' }}>
              <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}
                  >
                    <div className="message-bubble">
                      {msg.sender === 'ai' && (msg.text || msg.content)
                        ? (msg.text || msg.content).split(/\n\s*\n|\r\n\r\n|\*/g).map((para, i) =>
                            para.trim() && (
                              <p key={i} style={{ margin: '10px 0' }}>{para.trim()}</p>
                            )
                          )
                        : (msg.text || msg.content)
                      }
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="message ai-message">
                    <div className="message-bubble typing">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <form onSubmit={handleChatSubmit} className="chat-form" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message here..."
                disabled={chatLoading || chatStopped}
                className="chat-input"
                style={{ flex: 1 }}
              />
              <button 
                type="submit" 
                disabled={chatLoading || !chatInput.trim() || chatStopped}
                className="send-button"
                style={{ minWidth: 36, height: 36, borderRadius: 18, fontSize: 18, padding: 0 }}
              >
                <span className="send-icon">→</span>
              </button>
              <button
                type="button"
                style={{ minWidth: 36, height: 36, borderRadius: 18, fontSize: 13, padding: 0, marginLeft: 2, border: '1px solid #e74c3c', background: chatStopped ? '#e74c3c' : '#232323', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                onClick={handleStopChat}
                title={chatStopped ? 'Resume Chat' : 'Stop Chat'}
                disabled={chatLoading && !chatStopped && !chatAbortController}
              >
                {chatStopped ? '▶' : '■'}
              </button>
            </form>
          </section>
        )}

        {page === 'news' && <News />}
      </div>
    </>
  );
}

export default App;
