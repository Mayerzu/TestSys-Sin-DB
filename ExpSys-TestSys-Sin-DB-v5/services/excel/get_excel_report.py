from services.excel.excel_store import get_excel_data_store
from services.get_recommendations import get_recommendations
from services.get_top_areas import get_top_areas
from utils.get_area_percentage import get_area_percentage
from utils.get_report_data import get_report_data

def get_excel_report(id):
   excel_data = get_excel_data_store()

   if id > len(excel_data): return {}

   index = id - 1
   user = excel_data[index]
   scores = user['scores']
   
   data  = {
      'name': user['name'],
      'age': user['age'],
      'evaluation_date': user['evaluation_date'],
      'phone': user['phone'],
      'email': user['email']
   }

   top_areas = get_top_areas(scores)
   recommendations = get_recommendations(top_areas)
   careers, areas = get_report_data(recommendations, top_areas, scores)

   all_top_areas = top_areas['top_three_areas']
   
   area_1 = all_top_areas[0]
   area_2 = all_top_areas[1]
   area_3 = all_top_areas[2]

   score_1 = scores[area_1]['score']
   score_2 = scores[area_2]['score']
   score_3 = scores[area_3]['score']
   
   percentages = [
      get_area_percentage(score_1),
      get_area_percentage(score_2),
      get_area_percentage(score_3)
   ]

   data['areas'] = areas
   data['careers'] = careers
   data['top_areas'] = areas.split(', ')
   data['recommendations'] = careers.split(', ')
   data['percentages'] = percentages

   return data