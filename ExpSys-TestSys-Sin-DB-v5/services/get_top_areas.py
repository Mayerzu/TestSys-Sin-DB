from collections import defaultdict

def get_top_areas(scores):
   # Agrupar areas por puntaje
   grouped_scores = defaultdict(list)

   for area, obj in scores.items():
      score = obj['score']
      grouped_scores[score].append(area)

   # Todos los puntajes fueron cero
   if len(grouped_scores) == 1 and next(iter(grouped_scores)) == 0:
      return {
         'top_area': '',
         'top_two_areas': (),
         'top_three_areas': ()
      }

   # Ordenar los puntajes de mayor a menor
   ordered_scores = sorted(grouped_scores.keys(), reverse=True)
   
   # Extraer las áreas mejor puntuadas según top 3, top 2, top 1
   top_areas = []

   for score in ordered_scores:
      top_areas.extend(grouped_scores[score])

      if len(top_areas) >= 3:
         break  # Ya hay al menos 3 áreas
   
   top_1 = top_areas[:1]
   top_2 = tuple(top_areas[:2])
   top_3 = tuple(top_areas[:3])

   return {
      'top_area': top_1[0],
      'top_two_areas': top_2,
      'top_three_areas': top_3
   }