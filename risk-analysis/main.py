from fastapi import FastAPI, Depends
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
import pandas as pd
import numpy as np
import yfinance as yf
from database import SessionLocal, engine


app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Calculate beta of stock relative to indices
def calculate_beta(stock_returns, index_returns):
    covariance = stock_returns.cov(index_returns)
    variance = index_returns.var()
    beta = covariance / variance
    return beta

@app.get("/risk-summary/{user_id}")
def risk_summary(user_id: int):

    portfolio_query = "SELECT * FROM investors_portfolio WHERE investor_id = :user_id"
    with engine.connect() as connection:
        portfolio_result = connection.execute(text(portfolio_query), {"user_id": user_id}).fetchone()

    if not portfolio_result:
        return {"user_id": user_id, "error": "No portfolio found"}

    print ("portfolio_result: ", portfolio_result)

    portfolio_id = portfolio_result[0]

    print("portfolio_id: ", portfolio_id)

    query = """
        SELECT stock_symbol, quantity 
        FROM stock_holdings 
        WHERE portfolio_id = :portfolio_id
    """

    df = pd.read_sql(text(query), engine, params={"portfolio_id": portfolio_id})

    print (df.head())

    df = df[df['quantity'] > 0]

    if df.empty:
        return {"user_id": portfolio_id, "error": "No holdings found"}


    # Define symbols
    stock_symbols = df["stock_symbol"].unique().tolist()


    index_symbols = ["^IXIC", "^GSPC"]  # NASDAQ (^IXIC), S&P 500 (^GSPC)

    all_symbols = stock_symbols + index_symbols
    print(all_symbols)

    # Download historical data for past 1 year
    close_prices = yf.download(all_symbols, period="1y", interval="1d")['Close'].dropna()

    # Calculate daily returns
    returns = close_prices.pct_change().dropna()

    # Calculate volatility (std dev of returns) for stock and indices
    volatility = returns.std() * (252 ** 0.5)  # Annualized volatility (252 trading days)

    result = []

    for stock in stock_symbols:
        beta_nasdaq = calculate_beta(returns[stock], returns["^IXIC"])
        beta_sp500 = calculate_beta(returns[stock], returns["^GSPC"])

        result.append({
            "stock": stock,
            "volatility": round(volatility[stock], 4),
            "beta_vs_nasdaq": round(beta_nasdaq, 4),
            "beta_vs_sp500": round(beta_sp500, 4),
            "risk_level": (
                "High" if max(beta_nasdaq, beta_sp500) > 1
                else "Medium" if max(beta_nasdaq, beta_sp500) == 1
                else "Low"
            )
        })

    return {
        "user_id": user_id,
        "portfolio_id": portfolio_id,
        "risk_summary": result
    }
