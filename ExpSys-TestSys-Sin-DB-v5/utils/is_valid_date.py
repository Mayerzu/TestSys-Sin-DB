from datetime import datetime

def is_valid_date(date_str, format="%Y-%m-%d"):
   date = str(date_str)
   
   try:
      datetime.strptime(date, format)
      return True
   except ValueError:
      return False