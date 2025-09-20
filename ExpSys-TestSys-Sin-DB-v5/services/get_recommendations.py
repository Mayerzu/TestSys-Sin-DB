from data.one_area import rules_by_area
from data.two_areas import rules_by_two_areas
from data.three_areas import rules_by_three_areas

# top_areas = tuple,  areas = { ('', ''): ('', '', '') }
def get_careers(top_areas, areas):
   top_set = set(top_areas)

   for key in areas:
      if set(key) == top_set:
         return areas[key]
   
   return ()

# top_areas = { top_area,top_two_areas, top_three_areas }
def get_recommendations(top_areas):
   area = top_areas['top_area']
   two_areas = top_areas['top_two_areas']
   three_areas = top_areas['top_three_areas']

   recommendation_area = ()

   if area in rules_by_area:
      recommendation_area = rules_by_area[area]

   recommendation_two_areas = get_careers(two_areas, rules_by_two_areas)
   recommendation_three_areas = get_careers(three_areas, rules_by_three_areas)

   return {
      'recommendation_area': recommendation_area,
      'recommendation_two_areas': recommendation_two_areas,
      'recommendation_three_areas': recommendation_three_areas
   }