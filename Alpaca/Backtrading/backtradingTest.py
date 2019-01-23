import backtrader as bt
import alpaca_backtrader_api

class SmaCross(bt.SignalStrategy):
    def __init__(self):
        sma1, sma2 = bt.ind.SMA(period=10), bt.ind.SMA(period=30)
        crossover = bt.ind.CrossOver(sma1, sma2)
        self.signal_add(bt.SIGNAL_LONG, crossover)

cerebro = bt.Cerebro()
cerebro.addstrategy(SmaCross)

store = alpaca_backtrader_api.AlpacaStore(
    key_id='my_paper_key',
    secret_key='my_paper_secret_key',
    paper=True
)

broker = alpaca_backtrader_api.AlpacaBroker() # store.getbroker()  # or just alpaca_backtrader_api.AlpacaBroker()
cerebro.setbroker(broker)

DataFactory = store.getdata # or use alpaca_backtrader_api.AlpacaData
data0 = DataFactory(dataname='AAPL', timeframe=bt.TimeFrame.TFrame("Days"))  # Supported timeframes: "Days"/"Minutes"
cerebro.adddata(data0)

cerebro.run(exactbars=1)
cerebro.plot()