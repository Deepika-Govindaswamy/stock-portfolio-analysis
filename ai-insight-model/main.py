from fastapi import FastAPI, Depends
from openai import OpenAI
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
import numpy as np
import yfinance as yf
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import pandas as pd
import openai
from datetime import datetime, timedelta
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sqlalchemy import text
from fastapi import FastAPI, HTTPException
from database import engine

app: FastAPI = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPPORTED_STOCKS = ['AAPL', 'GOOGL', 'TSLA', 'AMZN', 'MSFT']

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def convert_numpy_types(obj):
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    return obj

class SimplifiedPortfolioAnalyzer:
    def __init__(self):
        self.stock_data = {}

    def fetch_stock_data(self, symbols: list, days: int = 30):
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        for symbol in symbols:
            try:
                ticker = yf.Ticker(symbol)
                data = ticker.history(start=start_date, end=end_date)
                if not data.empty:
                    self.stock_data[symbol] = data
                    print(f"✓ Fetched data for {symbol}")
            except Exception as e:
                print(f"✗ Error fetching {symbol}: {e}")

    def analyze_trends(self, portfolio_holdings: dict):
        """Detect unusual trends in portfolio stocks"""
        results = {
            'unusual_gains': [],
            'unusual_losses': [],
            'volatility_spikes': [],
            'analysis_summary': {}
        }

        for symbol, shares in portfolio_holdings.items():
            if symbol not in self.stock_data or shares <= 0:
                continue

            data = self.stock_data[symbol]
            if len(data) < 5:
                continue

            # Calculate metrics
            current_price = float(data['Close'].iloc[-1])
            prev_price = float(data['Close'].iloc[-2]) if len(data) > 1 else current_price
            daily_change = (current_price - prev_price) / prev_price

            # Calculate 5-day average return and volatility
            returns = data['Close'].pct_change().dropna()
            recent_avg_return = float(returns.tail(5).mean())
            current_volatility = float(returns.rolling(5).std().iloc[-1])
            avg_volatility = float(returns.std())

            position_value = shares * current_price
            impact = daily_change * position_value

            # Store analysis data
            results['analysis_summary'][symbol] = {
                'current_price': current_price,
                'daily_change': daily_change,
                'recent_avg_return': recent_avg_return,
                'volatility': current_volatility if not np.isnan(current_volatility) else 0.0,
                'position_value': position_value,
                'shares': float(shares)
            }

            # Detect unusual gains (>5% daily change)
            if daily_change > 0.05:
                results['unusual_gains'].append({
                    'symbol': symbol,
                    'daily_change': daily_change,
                    'impact': impact,
                    'shares': float(shares),
                    'price': current_price
                })

            # Detect unusual losses (<-5% daily change)
            elif daily_change < -0.05:
                results['unusual_losses'].append({
                    'symbol': symbol,
                    'daily_change': daily_change,
                    'impact': impact,
                    'shares': float(shares),
                    'price': current_price
                })

            # Detect volatility spikes (>1.5x average)
            if not np.isnan(current_volatility) and not np.isnan(avg_volatility) and current_volatility > avg_volatility * 1.5:
                results['volatility_spikes'].append({
                    'symbol': symbol,
                    'current_volatility': current_volatility,
                    'avg_volatility': avg_volatility,
                    'shares': float(shares)
                })

        return results

    def calculate_diversification(self, portfolio_holdings: dict):
        if not portfolio_holdings:
            return {'score': 0, 'clusters': {}, 'suggestions': []}

        # Calculate diversification score (Herfindahl-Hirschman Index)
        total_value = 0
        position_values = {}

        for symbol, shares in portfolio_holdings.items():
            if symbol in self.stock_data and shares > 0:
                current_price = float(self.stock_data[symbol]['Close'].iloc[-1])
                value = shares * current_price
                position_values[symbol] = value
                total_value += value

        if total_value == 0:
            return {'score': 0, 'clusters': {}, 'suggestions': []}

        # Calculate weights and HHI
        weights = [value / total_value for value in position_values.values()]
        hhi = sum(w ** 2 for w in weights)

        # Convert to diversification score
        max_hhi = 1.0
        min_hhi = 1.0 / len(SUPPORTED_STOCKS)
        diversification_score = (max_hhi - hhi) / (max_hhi - min_hhi) if max_hhi != min_hhi else 1.0
        diversification_score = max(0, min(1, diversification_score))

        # Perform clustering analysis
        clusters = self.perform_clustering()
        suggestions = self.generate_diversification_suggestions(portfolio_holdings, clusters)

        return {
            'score': float(diversification_score),
            'clusters': clusters,
            'suggestions': suggestions,
            'position_breakdown': position_values,
            'total_value': total_value
        }

    def perform_clustering(self):
        try:
            features_data = []
            symbols = []

            for symbol in SUPPORTED_STOCKS:
                if symbol not in self.stock_data:
                    continue

                data = self.stock_data[symbol]
                returns = data['Close'].pct_change().dropna()

                if len(returns) < 10:
                    continue

                avg_return = float(returns.mean())
                volatility = float(returns.std())
                sharpe = avg_return / volatility if volatility > 0 else 0

                features_data.append([avg_return, volatility, sharpe])
                symbols.append(symbol)

            if len(features_data) < 3:
                return {}

            scaler = StandardScaler()
            features_scaled = scaler.fit_transform(features_data)

            n_clusters = min(3, len(features_data))
            kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
            cluster_labels = kmeans.fit_predict(features_scaled)

            # Group stocks by cluster
            clusters = {}
            for i, symbol in enumerate(symbols):
                cluster_id = int(cluster_labels[i])
                if cluster_id not in clusters:
                    clusters[cluster_id] = []
                clusters[cluster_id].append(symbol)

            return clusters

        except Exception as e:
            print(f"Clustering error: {e}")
            return {}

    def generate_diversification_suggestions(self, portfolio_holdings: dict, clusters: dict):
        """Generate diversification suggestions based on clustering"""
        suggestions = []

        if not clusters:
            return suggestions

        current_symbols = set(portfolio_holdings.keys())

        for cluster_id, cluster_stocks in clusters.items():
            cluster_representation = len([s for s in cluster_stocks if s in current_symbols])

            if cluster_representation == 0:
                suggested_stock = cluster_stocks[0]
                suggestions.append({
                    'type': 'add_stock',
                    'symbol': suggested_stock,
                    'reason': f'No exposure to cluster {cluster_id} ({", ".join(cluster_stocks)})',
                    'action': f'Consider adding {suggested_stock} for better diversification'
                })
            elif cluster_representation == len(cluster_stocks) and len(cluster_stocks) > 1:
                suggestions.append({
                    'type': 'reduce_concentration',
                    'symbols': [s for s in cluster_stocks if s in current_symbols],
                    'reason': f'Over-concentrated in cluster {cluster_id}',
                    'action': 'Consider reducing position sizes in this cluster'
                })

        return suggestions


def generate_ai_summary(trend_analysis: dict, diversification_analysis: dict, portfolio_total: float):

    gains = trend_analysis['unusual_gains']
    losses = trend_analysis['unusual_losses']
    volatility_spikes = trend_analysis['volatility_spikes']
    div_score = diversification_analysis['score']
    suggestions = diversification_analysis['suggestions']

    gains_str = "- Gains: " + str([(g['symbol'], f"{g['daily_change'] * 100:.1f}%") for g in gains]) if gains else ""
    losses_str = "- Losses: " + str(
        [(l['symbol'], f"{l['daily_change'] * 100:.1f}%") for l in losses]) if losses else ""

    prompt = f"""
        Analyze this portfolio and provide a clear, actionable summary:

        Portfolio Value: ${portfolio_total:,.2f}

        Recent Performance:
        - Stocks with unusual gains (>5%): {len(gains)} stocks
        {gains_str}
        - Stocks with unusual losses (<-5%): {len(losses)} stocks  
        {losses_str}
        - Volatility spikes detected: {len(volatility_spikes)} stocks

        Diversification:
        - Diversification Score: {div_score:.2f}/1.0
        - Suggestions: {len(suggestions)} recommendations

        Provide a 3-4 sentence summary that:
        1. Highlights the most important trend or concern
        2. Gives one specific actionable recommendation
        3. Maintains an encouraging, professional tone

        Keep it under 150 words and focus on actionable insights.
        """

    try:
        client = OpenAI()

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system",
                 "content": "You are a professional financial advisor providing clear, actionable portfolio insights."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.7
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"AI generation error: {e}")
        status = "performing well" if len(gains) > len(losses) else "showing mixed results" if len(gains) == len(
            losses) else "facing some challenges"
        return f"Your ${portfolio_total:,.0f} portfolio is {status} with {len(gains)} stocks showing gains and {len(losses)} showing losses. Diversification score is {div_score:.1f}/1.0. Consider reviewing positions with high volatility and maintaining balanced exposure across different stock clusters."


@app.get("/generate-ai-insights/{user_id}")
def generate_ai_insights(user_id: int):

    try:
        # Get user's portfolio data
        portfolio_query = "SELECT * FROM investors_portfolio WHERE investor_id = :user_id"
        with engine.connect() as connection:
            portfolio_result = connection.execute(text(portfolio_query), {"user_id": user_id}).fetchone()

        if not portfolio_result:
            raise HTTPException(status_code=404, detail=f"No portfolio found for user {user_id}")

        portfolio_id = portfolio_result[0]
        print(f"Analyzing portfolio {portfolio_id} for user {user_id}")

        # Get stock holdings
        query = """
                SELECT stock_symbol, quantity
                FROM stock_holdings
                WHERE portfolio_id = :portfolio_id \
                  AND quantity > 0 \
                """

        df = pd.read_sql(text(query), engine, params={"portfolio_id": portfolio_id})

        if df.empty:
            raise HTTPException(status_code=404, detail="No stock holdings found in portfolio")

        # Convert to dictionary and filter for supported stocks
        portfolio_holdings = {}
        for _, row in df.iterrows():
            symbol = row['stock_symbol'].upper()
            if symbol in SUPPORTED_STOCKS:
                portfolio_holdings[symbol] = float(row['quantity'])

        if not portfolio_holdings:
            raise HTTPException(status_code=400,
                                detail=f"No supported stocks found. Supported: {', '.join(SUPPORTED_STOCKS)}")

        print(f"Portfolio holdings: {portfolio_holdings}")

        # Initialize analyzer and fetch market data
        analyzer = SimplifiedPortfolioAnalyzer()
        analyzer.fetch_stock_data(list(portfolio_holdings.keys()))

        if not analyzer.stock_data:
            raise HTTPException(status_code=500, detail="Failed to fetch market data")

        # Perform trend analysis
        trend_analysis = analyzer.analyze_trends(portfolio_holdings)
        print(f"Trend analysis: {trend_analysis}")

        # Perform diversification analysis
        diversification_analysis = analyzer.calculate_diversification(portfolio_holdings)
        print(f"Diversification analysis: {diversification_analysis}")

        # Generate AI summary
        portfolio_total = diversification_analysis.get('total_value', 0)
        ai_summary = generate_ai_summary(trend_analysis, diversification_analysis, portfolio_total)

        # Compile comprehensive response
        response = {
            "user_id": user_id,
            "portfolio_id": portfolio_id,
            "analysis_timestamp": datetime.now().isoformat(),
            "portfolio_summary": {
                "total_value": float(portfolio_total),
                "holdings": {k: float(v) for k, v in portfolio_holdings.items()},
                "supported_stocks_count": len(portfolio_holdings)
            },
            "ai_insights": {
                "summary": ai_summary,
                "key_findings": {
                    "unusual_gains_count": len(trend_analysis['unusual_gains']),
                    "unusual_losses_count": len(trend_analysis['unusual_losses']),
                    "volatility_spikes_count": len(trend_analysis['volatility_spikes']),
                    "diversification_score": round(diversification_analysis['score'], 2)
                }
            },
            "trend_analysis": convert_numpy_types(trend_analysis),
            "diversification_analysis": {
                "score": round(diversification_analysis['score'], 2),
                "score_interpretation": (
                    "Excellent" if diversification_analysis['score'] > 0.8 else
                    "Good" if diversification_analysis['score'] > 0.6 else
                    "Fair" if diversification_analysis['score'] > 0.4 else
                    "Poor"
                ),
                "clusters": diversification_analysis['clusters'],
                "suggestions": diversification_analysis['suggestions'],
                "position_breakdown": {k: float(v) for k, v in diversification_analysis['position_breakdown'].items()}
            },
            "recommendations": {
                "immediate_actions": [],
                "long_term_suggestions": diversification_analysis['suggestions'][:3]  # Top 3 suggestions
            }
        }

        # Add immediate action recommendations based on analysis
        if trend_analysis['unusual_losses']:
            worst_performer = max(trend_analysis['unusual_losses'], key=lambda x: abs(x['daily_change']))
            response["recommendations"]["immediate_actions"].append(
                f"Monitor {worst_performer['symbol']} closely - down {worst_performer['daily_change'] * 100:.1f}% today"
            )

        if trend_analysis['volatility_spikes']:
            volatile_stock = trend_analysis['volatility_spikes'][0]['symbol']
            response["recommendations"]["immediate_actions"].append(
                f"Consider reviewing {volatile_stock} position due to increased volatility"
            )

        if diversification_analysis['score'] < 0.5:
            response["recommendations"]["immediate_actions"].append(
                "Portfolio diversification is below optimal - consider rebalancing"
            )

        return response

    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    # uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True, log_level="info")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )