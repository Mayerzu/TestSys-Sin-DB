def get_area_percentage(score): 
   max_score = 48 # 12 preguntas x 4 -> 4 = puntaje maximo por pregunta
   percentage = (score / max_score) * 100
   return round(percentage)