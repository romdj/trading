import pandas_datareader as pdr
import datetime 
import quandl 

aapl = pdr.get_data_yahoo('AAPL', 
  start=datetime.datetime(2006, 10, 1), 
  end=datetime.datetime(2012, 1, 1))

aapl2 = quandl.get("WIKI/AAPL", start_date="2006-10-01", end_date="2012-01-01")
