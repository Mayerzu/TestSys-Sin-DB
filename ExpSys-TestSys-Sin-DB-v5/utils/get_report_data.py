def get_report_data(recommendations, top_areas, scores):
   areas = []

   if len(recommendations['recommendation_three_areas']) > 0:
      for area in top_areas['top_three_areas']:
         area_name = scores[area]['area_name']
         areas.append(area_name)

      return(
         ', '.join(recommendations['recommendation_three_areas']), 
         ', '.join(areas)
      )
   
   elif len(recommendations['recommendation_two_areas']) > 0:
      for area in top_areas['top_three_areas']:
         area_name = scores[area]['area_name']
         areas.append(area_name)

      return (
         ', '.join(recommendations['recommendation_two_areas']), 
         ', '.join(areas)
      )
      
   else:
      for area in top_areas['top_three_areas']:
         area_name = scores[area]['area_name']
         areas.append(area_name)

      return (
         ', '.join(recommendations['recommendation_area']), 
         ', '.join(areas)
      )