import streamlit as st
import numpy as np
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt
from scipy.optimize import minimize
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import re
import requests

# ------------------ FUTURISTIC THEME & HEADER ------------------


def run_crypto_optimizer(tickers, start_date, end_date, risk_free_rate=0.01, target_return=None, max_weight=0.4):  
    # Download historical data  
    data = yf.download(tickers.split(','), start=start_date, end=end_date)['Adj Close']  
    returns = data.pct_change().dropna()  
    mean_returns = returns.mean()  
    cov_matrix = returns.cov()  
  
    # Dummy optimization logic (customize with your actual optimizer code)  
    num_assets = len(tickers.split(','))  
    init_guess = num_assets * [1. / num_assets]  
      
    def portfolio_return(weights):  
        return np.sum(mean_returns * weights) * 252  
      
    def portfolio_volatility(weights):  
        return np.sqrt(np.dot(weights.T, np.dot(cov_matrix * 252, weights)))  
      
    def sharpe_ratio(weights):  
        return (portfolio_return(weights) - risk_free_rate) / portfolio_volatility(weights)  
      
    constraints = [{'type': 'eq', 'fun': lambda x: np.sum(x) - 1}]  
    bounds = tuple((0, max_weight) for asset in range(num_assets))  
      
    optimal = minimize(lambda x: -sharpe_ratio(x), init_guess, method='SLSQP', bounds=bounds, constraints=constraints)  
    optimal_weights = optimal.x  
      
    # Create a plot  
    fig, ax = plt.subplots(figsize=(9, 6))  
    ax.plot(data)  
    ax.set_title("Crypto Performance")  
    ax.set_xlabel("Date")  
    ax.set_ylabel("Price")  
      
    summary = "Optimized portfolio for {} from {} to {}\\n".format(tickers, start_date, end_date)  
    summary += "Weights: " + ", ".join(["{}: {:.2%}".format(asset, weight) for asset, weight in zip(data.columns, optimal_weights)])  
      
    return summary, fig  



# Apply custom styling
st.markdown('''
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Roboto:wght@400;500&display=swap');
    
    /* Dark background */
    body, .block-container {
        background-color: #1A1A1A;
    }
    
    /* Headers - PURPLE */
    h1, h2, h3, h4, h5, h6, .stTitle, .stHeader, .stHeadingContainer {
        font-family: 'Montserrat', sans-serif !important;
        font-weight: 700 !important;
        color: #9B59B6 !important;
    }
    
    /* Streamlit title specifically */
    .css-10trblm, .css-zt5igj {
        font-family: 'Montserrat', sans-serif !important;
        font-weight: 700 !important;
        color: #9B59B6 !important;
    }
    
    /* Body text - WHITE */
    p, span, li, label, .stMarkdown, .stText, div:not(.stTitle):not(.stHeader):not(.stHeadingContainer) {
        font-family: 'Roboto', sans-serif !important;
        color: #FFFFFF !important;
    }
    
    /* Buttons */
    .stButton>button {
        background-color: #9B59B6 !important;
        color: #FFFFFF !important;
        border: none !important;
        font-family: 'Montserrat', sans-serif !important;
        font-weight: 700 !important;
    }
    
    /* Dataframes and containers */
    .stDataFrame, .stTable {
        background-color: #1E1E1E !important;
    }
    
    /* To the Moon text */
    .moon-text {
        font-family: 'Montserrat', sans-serif !important;
        font-weight: 700 !important;
        color: #9B59B6 !important;
        font-size: 28px !important;
        text-align: center !important;
        margin-top: 15px !important;
    }
    
    /* Override for inputs to keep them white */
    .stTextInput>div>div>input, 
    .stSelectbox>div>div>div, 
    .stNumberInput>div>div>input {
        color: #FFFFFF !important;
    }
    </style>
''', unsafe_allow_html=True)




# Inject custom CSS for a futuristic look with better readability
st.markdown(
    """
    <style>
    /* Body & general text */
    body {
        background-color: #121212;
        color: #EDEDED;
    }
    h1, h2, h3, h4, h5, h6, label, .css-1d391kg {
        font-family: 'Orbitron', sans-serif;
        color: #00ffea;
    }
    .css-1d391kg, .css-1aumxhk {
        color: #00ffea;
        font-size: 18px;
    }
    /* Buttons */
    .stButton>button {
        background-color: #00ffea;
        color: #121212;
        border: none;
        font-size: 18px;
        padding: 10px 20px;
    }
    /* Streamlit dataframes and containers (improve spacing and font sizes) */
    .stDataFrame, .stTable {
        font-size: 18px;
    }
    .dataframe {
        font-size: 16px;
    }
    /* Text elements */
    p, div, span, li {
        font-size: 18px;
    }
    /* Adjust container padding */
    .block-container {
        padding: 2rem 2rem;
    }
    /* Make sure plots are large enough */
    .stPlot {
        width: 100%;
    }
    /* Improve widget appearance */
    .stSelectbox, .stMultiselect, .stDateInput {
        font-size: 18px;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# Header with Doge picture and 'To the Moon!' text in the top left corner
# Using a reliable Doge image URL from Wikipedia
st.markdown(
    """
    <div style='display: flex; align-items: center; margin-bottom: 20px;'>
      <img src='https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg' alt='Doge' style='width:400px; height:400px; object-fit:cover; border-radius:50%; margin-right:15px;'/>
      <h1 style='margin: 0; font-size: 64px;'>To the Moon! 🚀</h1>
    </div>
    """,
    unsafe_allow_html=True
)
# ------------------ END FUTURISTIC THEME & HEADER ------------------


class CryptoPortfolioOptimizer:
    def __init__(self, tickers=None, start_date=None, end_date=None):
        if tickers is None:
            self.tickers = ['BTC-USD', 'ETH-USD', 'BNB-USD', 'SOL-USD', 'XRP-USD']
        else:
            self.tickers = [t + '-USD' if not t.endswith('-USD') else t for t in tickers]
        
        if end_date is None:
            self.end_date = datetime.now()
        else:
            self.end_date = datetime.strptime(end_date, '%Y-%m-%d')
        
        if start_date is None:
            self.start_date = self.end_date - timedelta(days=365)
        else:
            self.start_date = datetime.strptime(start_date, '%Y-%m-%d')
        
        self.prices = None
        self.returns = None
        self.mean_returns = None
        self.cov_matrix = None
        self.efficient_frontier = None
    
    def fetch_data(self):
        data = yf.download(self.tickers, start=self.start_date, end=self.end_date)
        if 'Adj Close' in data.columns.levels[0]:
            self.prices = data['Adj Close']
        elif 'Close' in data.columns.levels[0]:
            self.prices = data['Close']
        else:
            self.prices = data[data.columns.levels[0][0]]
        
        if len(self.tickers) == 1:
            self.prices = pd.DataFrame(self.prices, columns=self.tickers)
        
        self.returns = self.prices.pct_change().dropna()
        self.mean_returns = self.returns.mean() * 252
        self.cov_matrix = self.returns.cov() * 252
        return self.prices
    
    def portfolio_performance(self, weights):
        portfolio_return = np.sum(self.mean_returns * weights)
        portfolio_volatility = np.sqrt(np.dot(weights.T, np.dot(self.cov_matrix, weights)))
        
        # Fixed Sharpe ratio calculation
        # If volatility is zero or very close to zero, return a very low Sharpe ratio
        # to avoid division by zero
        if portfolio_volatility < 1e-8:
            sharpe_ratio = -1000  # Arbitrary large negative number
        else:
            sharpe_ratio = portfolio_return / portfolio_volatility
            
        return portfolio_return, portfolio_volatility, sharpe_ratio
    
    def negative_sharpe(self, weights):
        return -self.portfolio_performance(weights)[2]
    
    def check_sum(self, weights):
        return np.sum(weights) - 1
    
    def optimize_portfolio(self, risk_aversion=5):
        num_assets = len(self.tickers)
        constraints = ({'type': 'eq', 'fun': self.check_sum})
        bounds = tuple((0, 1) for asset in range(num_assets))
        initial_guess = num_assets * [1. / num_assets]
        optimal_result = minimize(self.negative_sharpe, initial_guess, method='SLSQP', bounds=bounds, constraints=constraints)
        optimal_weights = optimal_result['x']
        optimal_return, optimal_volatility, optimal_sharpe = self.portfolio_performance(optimal_weights)
        optimal_portfolio = {
            'weights': dict(zip(self.tickers, optimal_weights)),
            'return': optimal_return,
            'volatility': optimal_volatility,
            'sharpe_ratio': optimal_sharpe
        }
        return optimal_portfolio
    
    def generate_efficient_frontier(self, points=100):
        target_returns = np.linspace(self.mean_returns.min(), self.mean_returns.max(), points)
        efficient_portfolios = []
        num_assets = len(self.tickers)
        bounds = tuple((0, 1) for asset in range(num_assets))
        initial_guess = num_assets * [1. / num_assets]
        for target in target_returns:
            constraints = (
                {'type': 'eq', 'fun': self.check_sum},
                {'type': 'eq', 'fun': lambda w, target=target: np.sum(self.mean_returns * w) - target}
            )
            result = minimize(lambda w: np.sqrt(np.dot(w.T, np.dot(self.cov_matrix, w))), initial_guess, method='SLSQP', bounds=bounds, constraints=constraints)
            if result['success']:
                volatility = result['fun']
                # Avoid division by zero when calculating Sharpe ratio
                if volatility < 1e-8:
                    sharpe = 0
                else:
                    sharpe = target / volatility
                    
                efficient_portfolios.append({
                    'return': target,
                    'volatility': volatility,
                    'sharpe': sharpe,
                    'weights': result['x']
                })
        
        self.efficient_frontier = pd.DataFrame([
            {'return': p['return'], 'volatility': p['volatility'], 'sharpe': p['sharpe']}
            for p in efficient_portfolios
        ])
        return self.efficient_frontier

# --- FastAPI app setup ---
app = FastAPI()

# Allow CORS for frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic models for request/response ---
class OptimizeRequest(BaseModel):
    tickers: List[str]
    start_date: str
    end_date: str
    risk_aversion: Optional[int] = 5
    investment_amount: Optional[float] = 10000

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str
    portfolio: Optional[dict] = None

class OptimizeResponse(BaseModel):
    expected_return: float
    volatility: float
    sharpe_ratio: float
    allocation: dict
    projection: dict
    efficient_frontier: list
    prices: dict
    backtest: dict = None  # Add backtest to response
    backtest_stats: dict = None
    monte_carlo: dict = None
    risk_contribution: dict = None

# --- API endpoint ---
@app.post("/api/optimize", response_model=OptimizeResponse)
def optimize_portfolio_api(req: OptimizeRequest):
    try:
        optimizer = CryptoPortfolioOptimizer(
            tickers=req.tickers,
            start_date=req.start_date,
            end_date=req.end_date
        )
        optimizer.fetch_data()
        optimizer.generate_efficient_frontier()
        optimal = optimizer.optimize_portfolio(risk_aversion=req.risk_aversion)
        # Prepare projection data (12 months)
        projection_periods = 12
        monthly_return = optimal['return'] / 12
        monthly_volatility = optimal['volatility'] / (12 ** 0.5)
        time_periods = list(range(projection_periods + 1))
        expected = [req.investment_amount * (1 + monthly_return) ** t for t in time_periods]
        optimistic = [req.investment_amount * (1 + monthly_return + monthly_volatility) ** t for t in time_periods]
        pessimistic = [req.investment_amount * (1 + monthly_return - monthly_volatility) ** t for t in time_periods]
        projection = {
            'months': time_periods,
            'expected': expected,
            'optimistic': optimistic,
            'pessimistic': pessimistic
        }
        # Efficient frontier as list of dicts
        ef = []
        if optimizer.efficient_frontier is not None:
            ef = optimizer.efficient_frontier.to_dict(orient='records')
        # Prices as dict
        prices = {}
        if optimizer.prices is not None:
            prices = optimizer.prices.to_dict()
        # --- Backtest: simulate portfolio value over time ---
        backtest = None
        backtest_stats = None
        if optimizer.prices is not None and optimal['weights']:
            weights = np.array(list(optimal['weights'].values()))
            port_returns = (optimizer.returns * weights).sum(axis=1)
            port_value = req.investment_amount * (1 + port_returns).cumprod()
            backtest = {
                'dates': port_value.index.strftime('%Y-%m-%d').tolist(),
                'values': port_value.values.tolist()
            }
            # Backtest stats
            total_return = (port_value.iloc[-1] / port_value.iloc[0]) - 1 if len(port_value) > 1 else 0
            rolling_max = port_value.cummax()
            drawdown = (port_value - rolling_max) / rolling_max
            max_drawdown = drawdown.min() if len(drawdown) > 0 else 0
            ann_vol = port_returns.std() * np.sqrt(252)
            backtest_stats = {
                'total_return': total_return,
                'max_drawdown': max_drawdown,
                'annualized_volatility': ann_vol
            }
        # --- Monte Carlo Simulation (using geometric mean as drift) ---
        monte_carlo = None
        if optimizer.returns is not None and optimal['weights']:
            n_sim = 1000
            n_months = 12
            weights = np.array(list(optimal['weights'].values()))
            port_returns = (optimizer.returns * weights).sum(axis=1)
            # Calculate geometric mean (CAGR) for drift
            mean_log = np.log1p(port_returns).mean()
            geo_mean = np.expm1(mean_log)
            sigma = port_returns.std()
            last_value = req.investment_amount
            sim_paths = np.zeros((n_sim, n_months + 1))
            sim_paths[:, 0] = last_value
            for s in range(n_sim):
                for t in range(1, n_months + 1):
                    rand = np.random.normal(geo_mean, sigma)
                    sim_paths[s, t] = sim_paths[s, t-1] * (1 + rand)
            percentiles = {
                'p10': np.percentile(sim_paths[:, -1], 10),
                'p50': np.percentile(sim_paths[:, -1], 50),
                'p90': np.percentile(sim_paths[:, -1], 90)
            }
            monte_carlo = {
                'paths': sim_paths.tolist(),
                'percentiles': percentiles
            }
        # --- Risk Contribution Calculation ---
        risk_contribution = None
        if optimizer.cov_matrix is not None and optimal['weights'] is not None:
            weights = np.array(list(optimal['weights'].values()))
            cov = optimizer.cov_matrix.values
            port_vol = np.sqrt(np.dot(weights.T, np.dot(cov, weights)))
            # Marginal contribution: cov_matrix * weights / port_vol
            mrc = np.dot(cov, weights) / port_vol
            # Total risk contribution: weights * marginal risk contribution
            trc = weights * mrc
            risk_contribution = dict(zip(list(optimal['weights'].keys()), trc / port_vol))  # as % of total risk
        return OptimizeResponse(
            expected_return=optimal['return'],
            volatility=optimal['volatility'],
            sharpe_ratio=optimal['sharpe_ratio'],
            allocation=optimal['weights'],
            projection=projection,
            efficient_frontier=ef,
            prices=prices,
            backtest=backtest,
            backtest_stats=backtest_stats,
            monte_carlo=monte_carlo,
            risk_contribution=risk_contribution
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- API endpoint ---
@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest, request: Request = None):
    try:
        user_message = req.message.strip()
        api_key = "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"
        openrouter_url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        messages = []
        # Improved system prompt: respond to greetings and intro questions, otherwise stay on topic
        system_prompt = {
            "role": "system",
            "content": (
                "You are a helpful assistant for cryptocurrency investing and portfolio optimization. "
                "If the user greets you (e.g., says 'Hello', 'Hi', or asks 'What do you do?'), respond with a friendly introduction about your crypto and portfolio optimization capabilities. "
                "If the user asks about anything else, politely redirect them to talk about cryptocurrencies or portfolio optimization."
            )
        }
        messages.append(system_prompt)
        if req.history:
            for msg in req.history:
                role = msg.get("role") or ("assistant" if msg.get("sender") == "ai" else "user")
                messages.append({"role": role, "content": msg.get("text") or msg.get("content")})
        messages.append({"role": "user", "content": user_message})
        model = getattr(req, 'model', None) or (request and (await request.json()).get('model')) or "openai/gpt-3.5-turbo"
        payload = {
            "model": model,
            "messages": messages,
            "max_tokens": 4096,  # Increased to model's likely maximum
            "temperature": 0.7
        }
        resp = requests.post(openrouter_url, headers=headers, json=payload, timeout=20)
        if resp.status_code == 200:
            data = resp.json()
            ai_content = data["choices"][0]["message"]["content"]
            return ChatResponse(response=ai_content)
        else:
            return ChatResponse(response=f"Sorry, the AI service returned an error: {resp.status_code} {resp.text}")
    except Exception as e:
        return ChatResponse(response=f"Sorry, I encountered an error: {str(e)}")

# --- API endpoint: Fetch Crypto News (remove skip/limit, use only category) ---
@app.get("/api/news")
def get_crypto_news():
    try:
        url = "https://openapiv1.coinstats.app/news?category=cryptocurrency"
        headers = {
            "X-API-KEY": "b/acqQuNfUwk97/1j4F/umrieV9oeWV9txiW3wKo/Yk=",
            "Accept": "application/json"
        }
        resp = requests.get(url, headers=headers, timeout=10)
        print(f"CoinStats API status: {resp.status_code}")
        print(f"CoinStats API response: {resp.text}")
        if resp.status_code == 200:
            data = resp.json()
            news = data.get("news") or data.get("result") or []
            return {"news": news}
        else:
            return {"news": [], "error": f"Failed to fetch news: {resp.status_code}"}
    except Exception as e:
        print(f"Error fetching news: {e}")
        return {"news": [], "error": str(e)}

# --- Main entry for dev server ---
if __name__ == "__main__":
    uvicorn.run("crypto_optimizer:app", host="0.0.0.0", port=8000, reload=True)


