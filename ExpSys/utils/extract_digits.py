def extract_digits(text):
   import re
   value = str(text)
   return re.sub(r'\D', '', value)